import fizzetch from '../../../../fizzetch.js'
import Timeline from '../../../../../../game/timeline.js'
import Subpage from '../subpage.js'
import ExploringSubpage from '../exploring/exploringSubpage.js'

const HTML = `
<div class='content-rows'>
  <div class='content-columns'>
    <di-combat-fighter-pane class="fighter1"></di-combat-fighter-pane>
    <div class="mid-thing">VS</div>
    <di-combat-fighter-pane class="fighter2"></di-combat-fighter-pane>
  </div>
  <div class="content-well feed">
    <di-combat-feed></di-combat-feed>
  </div>
</div>
`

export default class CombatSubpage extends Subpage{

  _cancelled = false

  constructor(page, adventurer, dungeonRun){
    super(page, adventurer, dungeonRun)
    this.innerHTML = HTML
    this.fighterPane1 = this.querySelector('.fighter1')
    this.fighterPane2 = this.querySelector('.fighter2')
    this.combatFeed = this.querySelector('di-combat-feed')

    if(!page.currentEvent.combatID){
      page.setSubpage(ExploringSubpage)
    }

    fizzetch(`/game/combat/${page.currentEvent.combatID}`).then(result => {
      this.load(result)
    })
  }
  get titleText(){
    return 'Fight!'
  }

  destroy(){
    this._cancelled = true
  }

  update(dungeonRun, options){
    // Get out of here if we were tabbed out
    if(options.source === 'socket'){
      if(!this.page.currentEvent.combatID){
        this._backToExploringPage()
      }
    }
  }

  load = async ({ combat, state }) => {

    this.timeline = new Timeline(combat.timeline)
    this.combat = combat

    this.fighterPane1.setFighter(combat.fighter1.data)
    this.fighterPane2.setFighter(combat.fighter2.data)
    this.combatFeed.setCombat(this.combat)
    this.combatFeed.setTimeline(this.timeline)

    // TODO: This only makes sense in monsters combat
    this.combatFeed.setText(`A ${combat.fighter2.data.name} draws near.`)

    this.timeline.time = state.currentTime - this.combat.startTime

    const currentEntry = this.timeline.currentEntry
    this._applyEntry(currentEntry, false)

    const waitUntilStartTime = Math.max(1000, this.combat.startTime - state.currentTime)
    setTimeout(() => {
      this._tick()
    }, waitUntilStartTime)
  }

  _tick(){
    const before = Date.now()
    setTimeout(() => {
      if(this._cancelled){
        return
      }
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
      this._backToExploringPage()
    }, 2200)
  }

  _backToExploringPage(){
    if(this._cancelled){
      return
    }
    this._cancelled = true
    this.page.setSubpage(ExploringSubpage)
  }
}

customElements.define('di-combat-subpage', CombatSubpage)