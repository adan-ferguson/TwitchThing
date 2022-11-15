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

    this._fighterPane1.setFighter(toFighterInstance(combat.fighter1.data, combat.fighter1.startState))
    this._fighterPane2.setFighter(toFighterInstance(combat.fighter2.data, combat.fighter2.startState))
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

  get combatID(){
    return this._combat._id
  }

  destroy(){
    this._destroyed = true
    this.emit('destroyed')
  }

  _setupTimeline(combat){
    this._timeline = new Timeline(combat.timeline)
    this._prevEntryIndex = this._timeline.currentEntryIndex
    this._applyEntries(this._timeline.entries[0], false)
    this._timeline.on('timechange', ({ before, after, jumped }) => {
      if(jumped || this._prevEntryIndex > this._timeline.currentEntryIndex){
        this._updatePanes(true)
      }else if(this._prevEntryIndex !== this._timeline.currentEntryIndex){
        const entries = this._timeline.entries.slice(this._prevEntryIndex + 1, this._timeline.currentEntryIndex + 1)
        this._prevEntryIndex = this._timeline.currentEntryIndex
        this._applyEntries(entries)
      }else if(after > this._timeline.firstEntry.time){
        this._fighterPane1.advanceTime(after - before)
        this._fighterPane2.advanceTime(after - before)
      }
      this._prevEntryIndex = this._timeline.currentEntryIndex
    })
  }

  _applyEntries(entries){
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
    this._updatePanes()
  }

  _updatePanes(cancelAnimations = false){
    if(this._destroyed){
      return
    }
    const currentEntry = this._timeline.currentEntry
    this._fighterPane1.setState(currentEntry.fighterState1, cancelAnimations)
    this._fighterPane2.setState(currentEntry.fighterState2, cancelAnimations)
    this._fighterPane1.advanceTime(this._timeline.timeSinceLastEntry)
    this._fighterPane2.advanceTime(this._timeline.timeSinceLastEntry)
  }

  async _performAction(action){
    this._getPane(action.owner).displayActionPerformed(action)
    action.results.forEach(result => {
      if(result.type === 'blank'){
        return
      }
      this._getPane(result.subject).displayResult(result, action.effect)
      result.triggeredEvents?.forEach(action => this._performAction(action))
    })
  }

  _getPane(fighterId){
    if(this._fighterPane1.fighterInstance.uniqueID === fighterId){
      return this._fighterPane1
    }else if(this._fighterPane2.fighterInstance.uniqueID === fighterId){
      return this._fighterPane2
    }
    throw 'Tried to get pane from fighter id, but there was none.'
  }

  _getEnemyPane(fighterId){
    if(this._fighterPane1.fighterInstance.uniqueID === fighterId){
      return this._fighterPane2
    }else if(this._fighterPane2.fighterInstance.uniqueID === fighterId){
      return this._fighterPane1
    }
    throw 'Tried to get pane from fighter id, but there was none.'
  }

  _performTickUpdate(tickUpdate){
    if(tickUpdate.results){
      this._performAction(tickUpdate)
    }else{
      this._getPane(tickUpdate.owner ?? tickUpdate.subject).displayResult(tickUpdate)
    }
  }
}