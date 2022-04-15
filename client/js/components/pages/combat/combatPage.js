import Page from '../page.js'
import fizzetch from '../../../fizzetch.js'
import Timeline from '../../../../../game/timeline.js'

const HTML = `
<div class='content-rows'>
  <div class='content-columns'>
    <di-combat-fighter-pane class="fighter1"></di-combat-fighter-pane>
    <div class="mid-thing">VS</div>
    <di-combat-fighter-pane class="fighter2"></di-combat-fighter-pane>
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

    // TODO: This only makes sense in monsters combat
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
    const currentEntry = this.timeline.currentEntry
    this._applyEntry(currentEntry, false)
  }

  _run(){
    this._tick()
  }

  _tick(){
    const before = Date.now()
    requestAnimationFrame(() => {
      this._advanceTime(Date.now() - before)
      if(this.timeline.finished){
        this._finish()
      }else{
        this._tick()
      }
    })
  }

  _applyEntry(timelineEntry, animate = true){
    this.timeline.time = timelineEntry.time
    this.fighterPane1.setState(timelineEntry.fighterState1, animate)
    this.fighterPane2.setState(timelineEntry.fighterState2, animate)
    this.fighterPane1.advanceTime(this.timeline.timeSinceLastEntry)
    this.fighterPane2.advanceTime(this.timeline.timeSinceLastEntry)
    this.combatFeed.setTime(this.timeline.time)
  }

  _advanceTime(ms){
    if(ms <= 0){
      return
    }
    const prevEntry = this.timeline.currentEntry
    this.timeline.time += ms
    if(prevEntry !== this.timeline.currentEntry){
      this._applyEntry(this.timeline.currentEntry)
    }else{
      this.fighterPane1.advanceTime(ms)
      this.fighterPane2.advanceTime(ms)
    }
    this.combatFeed.setTime(this.timeline.time)
    // TODO: clock?
  }

  _finish(){

    if(this.combat.fighter1.endState.hp){
      this.combatFeed.setText(`The ${this.combat.fighter2.data.name} has been defeated.`)
    }else if(this.combat.fighter2.endState.hp){
      this.combatFeed.setText(`${this.combat.fighter1.data.name} has been defeated.`)
    }else{
      this.combatFeed.setText('Time is up, combat is not going anywhere.')
    }

    setTimeout(() => {
      if(this.returnPage){
        this.app?.setPage(this.returnPage)
      }
    }, 2200)
  }
}

customElements.define('di-combat-page', CombatPage )