import Page from '../page.js'
import fizzetch from '../../../fizzetch.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import Timeline from '../../../../../game/timeline.js'

const HTML = `
<div class='flex-rows'>
  <div class='flex-columns'>
    <di-combat-fighter-pane class="fighter1"></di-combat-fighter-pane>
    <div class="mid-thing">VS.</div>
    <di-combat-fighter-pane class="fighter2"></di-combat-fighter-pane>
  </div>
  <div class="content-well">
    <di-combat-feed></di-combat-feed>
  </div>
</div>
`

export default class CombatPage extends Page{

  constructor(combatID){
    super()
    this.combatID = combatID
    this.innerHTML = HTML
    this.fighterPane1 = this.querySelector('.fighter1')
    this.fighterPane2 = this.querySelector('.fighter2')
  }

  async load(){

    debugger
    const { combat, currentTime } = await fizzetch(`/game/combat/${this.combatID}`)
    this.timeline = new Timeline(this.combat.timeline)
    this.combat = combat

    this.fighterPane1.setFighter(combat.fighter1)
    this.fighterPane2.setFighter(combat.fighter2)

    if(currentTime < combat.endTime){
      this._inProgress(currentTime)
    }else{
      this._isReplay()
    }

    this._run()
  }

  _inProgress(currentTime){
    // TODO: timer
    // this._setEndTime(currentTime)
    this.timeline.time = currentTime
  }

  _isReplay(){
    // TODO: timer
    this.timeline.time = 0
  }

  _setTime(time){
    this.timeline.time = time
    const entry = this.timeline.prevEntry
    this.fighterPane1.setState(entry.fighterState1)
    this.fighterPane1.advanceTime(this.timeline.timeSinceLastEntry)
    this.fighterPane2.setState(entry.fighterState2)
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
      if(nextEntry.time <= this.timeline.time + msToAdvance){
        this._applyEntry(nextEntry)
      }else{
        this._advanceTime(msToAdvance)
      }
      if(this.timeline.nextEntry)
        this._tick()
    })
  }

  _applyEntry(timelineEntry){
    this.timeline.time = timelineEntry.time
    this.fighterPane1.setState(timelineEntry.fighterState1)
    this.fighterPane2.setState(timelineEntry.fighterState2)
    // TODO: log the entry
  }

  _advanceTime(ms){
    this.timeline.time += ms
    this.fighterPane1.advanceTime(ms)
    this.fighterPane2.advanceTime(ms)
    // TODO: clock?
  }
}

customElements.define('di-combat-page', CombatPage )