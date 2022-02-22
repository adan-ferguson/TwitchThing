import Page from '../page.js'
import fizzetch from '../../../fizzetch.js'
import Timeline from '../../../../../game/timeline.js'

const HTML = `
<div class='flex-rows'>
  <div class='flex-columns'>
    <div class="content-well">
        <di-combat-fighter-pane class="fighter1"></di-combat-fighter-pane>
    </div>
    <div class="mid-thing">VS</div>
    <div class="content-well">
        <di-combat-fighter-pane class="fighter2"></di-combat-fighter-pane>
    </div>
  </div>
  <div class="content-well">
    <di-combat-feed></di-combat-feed>
  </div>
</div>
`

export default class CombatPage extends Page{

  constructor(combatID, returnPage = null){
    super()
    this.combatID = combatID
    this.returnPage = returnPage
    this.innerHTML = HTML
    this.fighterPane1 = this.querySelector('.fighter1')
    this.fighterPane2 = this.querySelector('.fighter2')
    this.combatFeed = this.querySelector('di-combat-feed')
  }

  async load(){

    const { combat, state } = await fizzetch(`/game/combat/${this.combatID}`)
    this.timeline = new Timeline(combat.timeline)
    this.combat = combat

    this.fighterPane1.setFighter(combat.fighter1.data)
    this.fighterPane2.setFighter(combat.fighter2.data)
    this.combatFeed.setCombat(this.combat)
    this.combatFeed.setTimeline(this.timeline)

    // TODO: This only makes sense in monster combat
    this.combatFeed.setText(`A ${combat.fighter2.data.name} draws near.`)

    if(state.status === 'live'){
      this.timeline.time = state.currentTime - this.combat.startTime
    }else{
      this.timeline.time = 0
    }

    this._setup()

    const waitUntilStartTime = this.combat.startTime - state.currentTime
    if(waitUntilStartTime > 0){
      setTimeout(() => {
        this._run()
      }, waitUntilStartTime)
    }else{
      this._run()
    }
  }

  _inProgress(currentTime){
    // TODO: timer
    // this._setEndTime(currentTime)
    this.timeline.time = currentTime - this.combat.startTime
  }

  _isReplay(){
    // TODO: timer
    this.timeline.time = 0
  }

  _setTime(time){
    this.timeline.time = time
    const entry = this.timeline.prevEntry || this.timeline.firstEntry
    this.fighterPane1.setState(entry.fighterState1)
    this.fighterPane2.setState(entry.fighterState2)
    this.fighterPane1.advanceTime(this.timeline.timeSinceLastEntry)
    this.fighterPane2.advanceTime(this.timeline.timeSinceLastEntry)
  }

  _setup(){
    const currentTime = this.timeline.time
    const prevEntry = this.timeline.prevEntry
    this._applyEntry(prevEntry, false)
    this._setTime(currentTime - prevEntry.time)
  }

  _run(){
    if(this.timeline.nextEntry){
      this._tick()
    }else{
      this._finish()
    }
  }

  _tick(){
    const before = Date.now()
    requestAnimationFrame(() => {
      const nextEntry = this.timeline.nextEntry
      const msToAdvance = Date.now() - before
      if(!nextEntry){
        return this._finish()
      }
      if(nextEntry.time <= this.timeline.time + msToAdvance){
        this._applyEntry(nextEntry)
      }else{
        this._advanceTime(msToAdvance)
      }
      this._tick()
    })
  }

  _applyEntry(timelineEntry, animate = true){
    this.timeline.time = timelineEntry.time
    this.fighterPane1.setState(timelineEntry.fighterState1, animate)
    this.fighterPane2.setState(timelineEntry.fighterState2, animate)
    this.combatFeed.setTime(this.timeline.time)
  }

  _advanceTime(ms){
    this.timeline.time += ms
    this.fighterPane1.advanceTime(ms)
    this.fighterPane2.advanceTime(ms)
    this.combatFeed.setTime(this.timeline.time)
    // TODO: clock?
  }

  _finish(){
    const adventurerWon = this.combat.fighter1.endState.hp > 0

    if(adventurerWon){
      this.combatFeed.setText(`The ${this.combat.fighter2.data.name} has been defeated.`)
    }else{
      this.combatFeed.setText(`${this.combat.fighter1.data.name} has been defeated.`)
    }

    setTimeout(() => {
      if(this.returnPage){
        this.app.setPage(this.returnPage)
      }
    }, 5000)
  }
}

customElements.define('di-combat-page', CombatPage )