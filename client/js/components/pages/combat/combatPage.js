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

  constructor(combatID, forceLive = true, returnPage = null){
    super()
    this.combatID = combatID
    this.returnPage = returnPage
    this.forceLive = forceLive
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
    }else if(this.forceLive){
      this.timeline.time = this.combat.duration
    }else{
      this.timeline.time = 0
    }

    this._setup()

    const waitUntilStartTime = Math.max(1000, this.combat.startTime - state.currentTime)
    setTimeout(() => {
      this._run()
    }, waitUntilStartTime)
  }

  _setup(){
    const prevEntry = this.timeline.prevEntry
    this._applyEntry(prevEntry, false)
    this.fighterPane1.advanceTime(this.timeline.timeSinceLastEntry)
    this.fighterPane2.advanceTime(this.timeline.timeSinceLastEntry)
  }

  _run(){
    this._tick()
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
    if(ms <= 0){
      return
    }
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
    }, 2200)
  }
}

customElements.define('di-combat-page', CombatPage )