import { EventEmitter } from 'events'
import { toFighterInstance } from '../../game/toFighterInstance.js'
import Timeline from '../../game/timeline.js'
import { arrayize } from '../../game/utilFunctions.js'

export default class CombatEnactment extends EventEmitter{

  _fighterPane1
  _fighterPane2
  _combat
  _timeline
  _destroyed = false

  constructor(fighterPane1, fighterPane2){
    super()
    this._fighterPane1 = fighterPane1
    this._fighterPane2 = fighterPane2
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
    return this._combatID
  }

  setPendingCombat(combatEvent){
    this._combatID = combatEvent.combatID
    this._fighterPane2.setFighter(toFighterInstance(combatEvent.monster))
    this._showRefereeTime()
  }

  setCombat(combat){
    this._combat = combat
    this._combatID = combat._id
    this._fighterPane1.setFighter(toFighterInstance(combat.fighter1.def, combat.fighter1.startState))
    this._fighterPane2.setFighter(toFighterInstance(combat.fighter2.def, combat.fighter2.startState))
    this._setupTimeline(combat)
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
      if(jumped){
        console.log('j')
      }
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
      if(this._timeline.finished){
        this.emit('finished')
      }
      this._prevEntryIndex = this._timeline.currentEntryIndex
    })
  }

  _applyEntries(entries){
    if(this._destroyed){
      return
    }
    entries = arrayize(entries)
    entries.forEach(entry => {
      entry.actions.forEach(action => {
        this._performAction(action)
      })
      entry.triggers.forEach(action => {
        debugger
        this._performAction(action)
      })
    })
    this._updatePanes()
  }

  _updatePanes(cancelAnimations = false){
    if(this._destroyed){
      return
    }
    const currentEntry = this._timeline.currentEntry
    if(!currentEntry){
      debugger
      this._showRefereeTime()
    }else{
      this._hideRefereeTime()
    }
    this._fighterPane1.setState(currentEntry.fighterState1, cancelAnimations)
    this._fighterPane2.setState(currentEntry.fighterState2, cancelAnimations)
    this._fighterPane1.advanceTime(this._timeline.timeSinceLastEntry)
    this._fighterPane2.advanceTime(this._timeline.timeSinceLastEntry)
  }

  async _performAction(action){
    this._getPane(action.actor).displayActionPerformed(action)
    action.results.forEach(result => {
      if(result.type === 'blank'){
        return
      }
      this._getPane(result.subject).displayResult(result, action)
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

  // _performTickUpdate(tickUpdate){
  //   if(tickUpdate.results){
  //     this._performAction(tickUpdate)
  //   }else{
  //     this._getPane(tickUpdate.owner ?? tickUpdate.subject).displayResult(tickUpdate)
  //   }
  // }

  _showRefereeTime(){
    // TODO: referee time
  }

  _hideRefereeTime(){
    // TODO: referee time
  }
}