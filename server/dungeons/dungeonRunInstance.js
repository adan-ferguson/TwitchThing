import { EventEmitter } from 'events'
import AdventurerInstance from '../../game/adventurerInstance.js'
import { generateEvent } from './dungeonEventPlanner.js'
import { addRewards } from './results.js'
import { ADVANCEMENT_INTERVAL } from './dungeonRunner.js'
import calculateResults from '../../game/dungeonRunResults.js'
import { performVenturingTicks } from '../actionsAndTicks/performVenturingTicks.js'
import { toArray } from '../../game/utilFunctions.js'

export default class DungeonRunInstance extends EventEmitter{

  shouldEmit = false
  _lastAdvancement = new Date()

  constructor(doc, user){
    super()
    this.doc = doc
    if(!this.adventurer.userID.equals(user._id)){
      throw 'User mismatch in dungeonRun instance'
    }
    this.user = user
    this._newEventIterator = this.events.length
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

  get newestEvent(){
    return this.events.at(-1)
  }

  get started(){
    return this.newestEvent ? true : false
  }

  get nextEventTime(){
    return this.newestEvent ? this.newestEvent.time + this.newestEvent.duration : 0
  }

  get pace(){
    return this.doc.dungeonOptions.pace ?? 'Brisk'
  }

  async setupInitialEvents(){
    this.doc.events = [{
      passTimeOverride: true,
      message: `${this.adventurer.name} enters the dungeon.`,
      roomType: 'entrance',
      time: -ADVANCEMENT_INTERVAL,
      duration: ADVANCEMENT_INTERVAL,
      floor: this.doc.floor
    }]
    this.doc.elapsedTime = -ADVANCEMENT_INTERVAL
    await this.advance()
  }

  async advance(){

    this.shouldEmit = true
    this._lastAdvancement = new Date()
    this.doc.elapsedTime += ADVANCEMENT_INTERVAL
    if(this.doc.elapsedTime < this.nextEventTime){
      this.shouldEmit = false
      return
    }

    console.log('ADVANCE TO', this.doc.elapsedTime)

    // Reset this each advancement to make sure that everything is synced up.
    // If we just let this roll, then it's possible the doc state is wrong but
    // we would never notice unless the server reloaded.
    this.adventurerInstance = new AdventurerInstance(this.doc.adventurer, this.doc.adventurerState)
    await this._nextEvent()
  }

  getNewEvents(){
    const slice = this.events.slice(this._newEventIterator)
    this._newEventIterator = this.events.length
    return slice
  }

  async _nextEvent(){
    this.doc.room = this.newestEvent?.nextRoom || this.doc.room
    this.doc.floor = this.newestEvent?.nextFloor || this.doc.floor
    this._addEvent(await generateEvent(this))
  }

  async _addEvent(events){

    let durationSum = 0
    events = toArray(events)
    events.forEach(e => {
      const nextEvent = {
        room: this.doc.room,
        floor: this.doc.floor,
        time: this.doc.elapsedTime + durationSum,
        duration: ADVANCEMENT_INTERVAL,
        ...e
      }
      this.doc.events.push(nextEvent)
      durationSum += e.duration ?? ADVANCEMENT_INTERVAL
      if(nextEvent.rewards){
        if(nextEvent.rewards.xp){
          nextEvent.rewards.xp = Math.ceil(nextEvent.rewards.xp)
        }
        this.doc.rewards = addRewards(this.doc.rewards, nextEvent.rewards)
      }
      this._updateStateAndPerformTicks(nextEvent)
    })

    const lastEvent = this.doc.events.at(-1)
    lastEvent.duration += (ADVANCEMENT_INTERVAL - (durationSum % ADVANCEMENT_INTERVAL)) % ADVANCEMENT_INTERVAL
    if(lastEvent.runFinished){
      this.doc.results = calculateResults(this.events)
      this.doc.finished = true
      lastEvent.duration = 0
    }
    this.doc.room = lastEvent.room
    this.doc.floor = lastEvent.floor
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