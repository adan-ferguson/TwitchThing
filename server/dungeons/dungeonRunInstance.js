import { EventEmitter } from 'events'
import AdventurerInstance from '../../game/adventurerInstance.js'
import { finishCombatEvent } from '../combat.js'
import { generateEvent } from './dungeonEventPlanner.js'
import { addRewards } from './results.js'
import { ADVANCEMENT_INTERVAL } from './dungeonRunner.js'
import calculateResults from '../../game/dungeonRunResults.js'
import { performVenturingTicks } from '../actionsAndTicks/performVenturingTicks.js'

export default class DungeonRunInstance extends EventEmitter{

  constructor(doc, user){
    super()
    this.doc = doc
    if(!this.adventurer.userID.equals(user._id)){
      throw 'User mismatch in dungeonRun instance'
    }
    this.user = user
    this._time = this.currentEvent?.time ?? 0
  }

  get time(){
    return this._time
  }

  get adventurer(){
    return this.doc.adventurer
  }

  get floor(){
    return this.doc.floor
  }

  get room(){
    return this.doc.room
  }

  /**
   * @returns {array}
   */
  get events(){
    return this.doc.events
  }

  get rewards(){
    return this.doc.rewards
  }

  get currentEvent(){
    return this.events.at(-1)
  }

  get started(){
    return this.currentEvent ? true : false
  }

  get nextEventTime(){
    return this.currentEvent ? this.currentEvent.time + this.currentEvent.duration : 0
  }

  get pace(){
    return this.doc.dungeonOptions.pace ?? 'Brisk'
  }

  async advance(nextEvent){

    this.shouldEmit = true

    if(this._time + ADVANCEMENT_INTERVAL < this.nextEventTime){
      this._time += ADVANCEMENT_INTERVAL
      this.shouldEmit = false
      return
    }else{
      this._time = this.nextEventTime
    }

    // Reset this each advancement to make sure that everything is synced up.
    // If we just let this roll, then it's possible the doc state is wrong but
    // we would never notice unless the server reloaded.
    this.adventurerInstance = new AdventurerInstance(this.doc.adventurer, this.doc.adventurerState)

    if(this.currentEvent?.stayInRoom){
      await this._continueEvent(this.currentEvent)
    }else if(nextEvent){
      this._addEvent(nextEvent)
    }else{
      await this._nextRoom()
    }

    this._resolveEvent(this.currentEvent)
  }

  async _continueEvent(event){
    if(event.combatID){
      this._addEvent(await finishCombatEvent(this, event))
    }
  }

  async _nextRoom(){
    this.doc.room = this.currentEvent?.nextRoom || this.doc.room + 1
    this.doc.floor = this.currentEvent?.nextFloor || this.doc.floor
    this._addEvent(await generateEvent(this))
  }

  async _addEvent(event){
    const nextEvent = {
      room: this.doc.room,
      floor: this.doc.floor,
      time: this.doc.elapsedTime,
      duration: ADVANCEMENT_INTERVAL,
      ...event
    }
    if(nextEvent.runFinished){
      nextEvent.duration = 0
    }
    // Make it a multiple of the advancement interval
    nextEvent.duration = Math.ceil(-0.01 + nextEvent.duration / ADVANCEMENT_INTERVAL) * ADVANCEMENT_INTERVAL
    this.doc.room = nextEvent.room
    this.doc.floor = nextEvent.floor
    this.doc.events.push(nextEvent)

    console.log(nextEvent)
  }

  async _resolveEvent(event){
    if(event.rewards){
      if(event.rewards.xp){
        event.rewards.xp = Math.ceil(event.rewards.xp)
      }
      this.doc.rewards = addRewards(this.doc.rewards, event.rewards)
    }
    event.duration = Math.ceil(event.duration / ADVANCEMENT_INTERVAL) * ADVANCEMENT_INTERVAL
    this._updateStateAndPerformTicks(event)
    this.doc.elapsedTime += event.duration

    if(event.runFinished){
      this.doc.results = calculateResults(this.events)
      this.doc.finished = true
    }
  }

  /**
   * @private
   * @param event
   */
  _updateStateAndPerformTicks(event){

    event.adventurerState = this.adventurerInstance.state

    if('hp' in this.adventurerInstance.state && isNaN(this.adventurerInstance.state.hpPct)){
      debugger
    }

    if (!event.passTimeOverride){ // Combats handle their own passage of time.
      this.adventurerInstance.advanceTime(event.duration)
      event.tickUpdates = performVenturingTicks(this.adventurerInstance, Math.floor(event.duration / 1000))
    }

    this.doc.adventurerState = this.adventurerInstance.state
  }
}