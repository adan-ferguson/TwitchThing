import Timeline from '../../../../../game/timeline.js'
import Page from '../page.js'
import { mergeElementOptions } from '../../../../../game/utilFunctions.js'

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

export default class CombatPage extends Page{

  _cancelled = false
  _options = {
    live: true,
    returnPage: null
  }

  constructor(combatID, options = {}){
    super()
    this.innerHTML = HTML
    this.fighterPane1 = this.querySelector('.fighter1')
    this.fighterPane2 = this.querySelector('.fighter2')
    this.combatFeed = this.querySelector('di-combat-feed')

    this._combatID = combatID
    this._options = mergeElementOptions(this._options, options)
  }

  get titleText(){
    return 'Fight!'
  }

  async load(previousPage){
    const { combat, state } = await this.fetchData(`/watch/combat/${this._combatID}`)

    // If it's live but the combat's already done, just get outta here
    if(state.status === 'finished' && !this._options.live && this._options.returnPage){
      this.redirectTo(this._options.returnPage)
      return
    }

    this.timeline = new Timeline(combat.timeline)
    this.combat = combat

    this.fighterPane1.setFighter(combat.fighter1)
    this.fighterPane2.setFighter(combat.fighter2)
    this.combatFeed.setCombat(this.combat)
    this.combatFeed.setTimeline(this.timeline)

    // TODO: This only makes sense in monster combat
    this.combatFeed.setText(`A ${combat.fighter2.data.name} draws near.`)

    this.timeline.time = state.currentTime - this.combat.startTime

    const currentEntry = this.timeline.currentEntry
    this._applyEntry(currentEntry, false)

    const waitUntilStartTime = Math.max(1000, this.combat.startTime - state.currentTime)
    setTimeout(() => {
      this._tick()
    }, waitUntilStartTime)
  }

  async unload(){
    this._cancelled = true
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

    timelineEntry.actions.forEach(action => {
      this._performAction(action)
    })

    timelineEntry.tickUpdates.forEach(tickUpdate => {
      this._performTickUpdate(tickUpdate)
    })

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

    if(this._options.returnPage){
      setTimeout(() => {
        this.redirectTo(this._options.returnPage)
      }, 2200)
    }
  }

  _performAction(action){
    this._getPaneFromFighterId(action.actor).displayActionPerformed(action.ability)
    action.results.forEach(result => {
      this._getPaneFromFighterId(result.subject).displayResult(result)
    })
  }

  _getPaneFromFighterId(fighterId){
    return this.fighterPane1.fighterId === fighterId ? this.fighterPane1 : this.fighterPane2
  }

  _performTickUpdate(tickUpdate){
    debugger
    this._getPaneFromFighterId(tickUpdate.source).displayResult(tickUpdate)
  }
}

customElements.define('di-combat-page', CombatPage)