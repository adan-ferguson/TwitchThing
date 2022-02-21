import Page from '../page.js'
import fizzetch from '../../../fizzetch.js'
import DungeonPage from '../dungeon/dungeonPage.js'
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

  constructor(combatID, adventurerID = null){
    super()
    this.combatID = combatID
    this.adventurerID = adventurerID
    this.innerHTML = HTML
    this.fighterPane1 = this.querySelector('.fighter1')
    this.fighterPane2 = this.querySelector('.fighter2')
    this.combatFeed = this.querySelector('di-combat-feed')
  }

  async load(){

    const { combat, state } = await fizzetch(`/game/combat/${this.combatID}`)
    console.log('combat state', combat.startTime, state.currentTime, combat.endTime, state.currentTime - combat.startTime)
    this.timeline = new Timeline(combat.timeline)
    this.combat = combat

    this.fighterPane1.setFighter(combat.fighter1.data)
    this.fighterPane2.setFighter(combat.fighter2.data)
    this.combatFeed.setCombat(this.combat)
    this.combatFeed.setTimeline(this.timeline)

    if(state.status === 'live'){
      this._inProgress(state.currentTime)
    }else{
      this._isReplay()
    }

    this._run()
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
    const entry = this.timeline.prevEntry
    this.fighterPane1.setState(entry.fighterState1)
    this.fighterPane1.advanceTime(this.timeline.timeSinceLastEntry)
    this.fighterPane2.setState(entry.fighterState2)
    this.fighterPane2.advanceTime(this.timeline.timeSinceLastEntry)
  }

  _run(){
    const currentTime = this.timeline.time
    const prevEntry = this.timeline.prevEntry
    this._applyEntry(prevEntry)
    if(this.timeline.nextEntry){
      this._advanceTime(currentTime - prevEntry.time)
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

  _applyEntry(timelineEntry){
    this.timeline.time = timelineEntry.time
    this.fighterPane1.setState(timelineEntry.fighterState1)
    this.fighterPane2.setState(timelineEntry.fighterState2)
    this.combatFeed.addEntry(timelineEntry)

    // TODO: log the entry
    // TODO: show the performed action somehow
  }

  _advanceTime(ms){
    this.timeline.time += ms
    this.fighterPane1.advanceTime(ms)
    this.fighterPane2.advanceTime(ms)
    this.combatFeed.setTime(this.timeline.time)
    // TODO: clock?
  }

  _finish(){
    // display the result
    // if this is a live combat, go back to the dungeon page or the results page
    // otherwise, do nothing? this is in a new tab right?
    setTimeout(() => {
      this.app.setPage(new DungeonPage(this.adventurerID))
    }, 5000)
  }
}

customElements.define('di-combat-page', CombatPage )