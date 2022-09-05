import { EventEmitter } from 'events'
import { toFighterInstance } from '../../game/toFighterInstance.js'
import Timeline from '../../game/timeline.js'
import { toArray } from '../../game/utilFunctions.js'

export default class CombatEnactment extends EventEmitter{

  _fighterPane1
  _fighterPane2
  _combat
  _timeline
  _destroyed = false

  constructor(fighterPane1, fighterPane2, combat){
    super()
    this._fighterPane1 = fighterPane1
    this._fighterPane2 = fighterPane2
    this._combat = combat

    const fighterInstance1 = toFighterInstance(combat.fighter1.data, combat.fighter1.startState)
    const fighterInstance2 = toFighterInstance(combat.fighter2.data, combat.fighter2.startState)
    this._fighterPane1.setFighter(fighterInstance1)
      .setOptions({
        inCombat: true
      })
    this._fighterPane2.setFighter(fighterInstance2)
      .setOptions({
        inCombat: true
      })
    this._setupTimeline(combat)
  }

  get fighterInstance1(){
    return this._fighterPane1.fighterInstance
  }

  get fighterInstance2(){
    return this._fighterPane2.fighterInstance
  }

  get timeline(){
    return this._timeline
  }

  destroy(){
    this._destroyed = true
    this.emit('destroyed')
  }

  _setupTimeline(combat){
    this._timeline = new Timeline(combat.timeline)
    this._prevEntryIndex = this._timeline.currentEntryIndex
    this._timeline.on('timechange', (oldTime, newTime) => {
      if(this._prevEntryIndex !== this._timeline.currentEntryIndex){
        this._applyEntries(this._timeline.entries.slice(this._prevEntryIndex + 1, this._timeline.currentEntryIndex + 1))
        this._prevEntryIndex = this._timeline.currentEntryIndex
      }else{
        this._fighterPane1.advanceTime(newTime - oldTime)
        this._fighterPane2.advanceTime(newTime - oldTime)
      }
    })
  }

  _applyEntries(entries, animate = true){
    if(this._destroyed){
      return
    }
    entries = toArray(entries)
    entries.forEach(entry => {
      entry.actions.forEach(action => {
        this._performAction(action)
      })
      entry.tickUpdates.forEach(tickUpdate => {
        this._performTickUpdate(tickUpdate)
      })
    })

    this._updatePanes(animate)
  }

  _updatePanes(animate){
    if(this._destroyed){
      return
    }
    const currentEntry = this._timeline.currentEntry
    this._timeline.time = currentEntry.time
    this._fighterPane1.setState(currentEntry.fighterState1, animate)
    this._fighterPane2.setState(currentEntry.fighterState2, animate)
    this._fighterPane1.advanceTime(this._timeline.timeSinceLastEntry)
    this._fighterPane2.advanceTime(this._timeline.timeSinceLastEntry)
  }

  _performAction(action){
    this._getPaneFromFighterId(action.actor).displayActionPerformed(action.ability)
    action.results.forEach(result => {
      this._getPaneFromFighterId(result.subject).displayResult(result)
    })
  }

  _getPaneFromFighterId(fighterId){
    if(this._fighterPane1.fighterInstance.uniqueID === fighterId){
      return this._fighterPane1
    }else if(this._fighterPane2.fighterInstance.uniqueID === fighterId){
      return this._fighterPane2
    }
    debugger
    throw 'Tried to get pane from fighter id, but there was none.'
  }

  _performTickUpdate(tickUpdate){
    this._getPaneFromFighterId(tickUpdate.subject).displayResult(tickUpdate)
  }
}