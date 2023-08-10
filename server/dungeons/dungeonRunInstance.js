import { EventEmitter } from 'events'
import { generateEvent } from './dungeonEventPlanner.js'
import { addRewards } from './results.js'
import { ADVANCEMENT_INTERVAL } from './dungeonRunner.js'
import calculateResults from '../../game/dungeonRunResults.js'
import AdventurerInstance from '../../game/adventurerInstance.js'
import { resumeCombatEvent } from '../combat/fns.js'
import { useAbility } from '../mechanics/actions/performAction.js'
import FullEvents from '../collections/fullEvents.js'

export default class _DungeonRunInstance extends EventEmitter{

  _fullEvents = []
  _lastAdvancement = new Date()
  _instructions = {
    leave: false
  }
  _newEventIterator = 0
  shouldEmit = false

  constructor(doc, user){
    super()
    this.doc = doc
    if(!this.adventurer.userID.equals(user._id)){
      throw 'User mismatch in dungeonRun instance'
    }
    this.user = user
  }

  get adventurer(){
    return this.doc.adventurer
  }

  get adventurerInstance(){
    if(!this._adventurerInstance){
      this._adventurerInstance = new AdventurerInstance(this.doc.adventurer, this.doc.adventurerState)
    }
    return this._adventurerInstance
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
    return this._fullEvents
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
    if(this.newestEvent){
      if(this.newestEvent.data.pending){
        return Number.POSITIVE_INFINITY
      }
      return this.newestEvent.data.time + this.newestEvent.data.duration
    }
    return 0
  }

  get pace(){
    return this.doc.dungeonOptions.pace ?? 'Brisk'
  }

  get restThreshold(){
    return this.doc.dungeonOptions.restThreshold ?? 0
  }

  get instructions(){
    return this._instructions
  }

  async initialize(){
    await this._saveFullEvent({
      message: `${this.adventurer.name} enters the dungeon.`,
      roomType: 'entrance',
      time: -ADVANCEMENT_INTERVAL,
      duration: ADVANCEMENT_INTERVAL,
      floor: this.doc.floor,
    })
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

    if(this.newestEvent?.data.runFinished){
      this.doc.finished = true
      this.doc.elapsedTime = this.nextEventTime
      this.doc.results = calculateResults(this.events.map(e => e.data))
      return
    }

    await this._nextEvent()
  }

  async cancel(message){
    await this._addEvent({
      roomType: 'outOfOrder',
      runFinished: true,
      message: `${this.adventurerInstance.displayName} finds a secret message! It says: "${message}". Suddenly, everything explodes.`
    })
    this.doc.elapsedTime = this.nextEventTime
    this.doc.results = calculateResults(this.events)
    this.doc.finished = true
  }

  getNewEvents(){
    const slice = this.events.slice(this._newEventIterator)
    this._newEventIterator = this.events.length
    return slice
  }

  updateInstructions(val){
    if(!val){
      return
    }
    this._instructions = {
      ...this._instructions,
      ...val
    }
  }

  finishRunningCombat(newCombatEventData, resultEventData){
    this.shouldEmit = true
    this.newestEvent.data = newCombatEventData
    resultEventData.time = newCombatEventData.time + newCombatEventData.duration
    FullEvents.save(this.newestEvent)
    this._addEvent(resultEventData)
  }

  async resume(){
    this._fullEvents = await FullEvents.findByDungeonRunID(this.doc._id)
    this._newEventIterator = this.events.length
    if(this.newestEvent?.data.pending){
      resumeCombatEvent(this)
    }
  }

  addPendingTriggers(triggers){
    // Just resolve them immediately, there's nothing in between triggering and resolving in a dungeon run.
    triggers.forEach(trigger => {
      useAbility(this, trigger.ability, trigger.data)
    })
  }

  async _nextEvent(){
    this.doc.room = this.newestEvent?.data.nextRoom || this.doc.room
    this.doc.floor = this.newestEvent?.data.nextFloor || this.doc.floor
    this._addEvent(await generateEvent(this))
  }

  async _addEvent(event){

    const nextEventData = {
      room: this.doc.room,
      floor: this.doc.floor,
      time: event.time ?? (this.newestEvent.data.time + this.newestEvent.data.duration),
      duration: ADVANCEMENT_INTERVAL,
      ...event
    }

    if(nextEventData.rewards){
      if(nextEventData.rewards.xp){
        nextEventData.rewards.xp = Math.ceil(nextEventData.rewards.xp)
      }
      this.doc.rewards = addRewards(this.doc.rewards, nextEventData.rewards)
    }

    if(!nextEventData.runFinished){
      nextEventData.duration += (ADVANCEMENT_INTERVAL - ((nextEventData.time + nextEventData.duration) % ADVANCEMENT_INTERVAL)) % ADVANCEMENT_INTERVAL
    }

    nextEventData.rewardsToDate = this.doc.rewards ?? {}

    this.doc.room = nextEventData.room
    this.doc.floor = nextEventData.floor

    this._updateState(nextEventData)
    this._saveFullEvent(nextEventData)
    this._fixTimeline()

    this.doc.elapsedTime = Math.min(this.doc.elapsedTime, this.nextEventTime)
  }

  /**
   * @private
   * @param event
   */
  _updateState(event){
    const state = {
      ...this.adventurerInstance.state,
      currentFloor: this.floor
    }
    event.adventurerState = state
    this.doc.adventurerState = state
    this._adventurerInstance = null
  }

  _fixTimeline(){
    if(!this.events.length){
      return
    }
    let time = this.events[0].data.time
    for(let i in this.events){
      const entry = this.events[i]
      if(entry.data.time !== time){
        entry.data.time = time
        FullEvents.save(entry)
      }
      time += entry.data.duration
    }
  }

  _saveFullEvent(data){
    const fullEvent = {
      dungeonRunID: this.doc._id,
      data,
    }
    this._fullEvents.push(fullEvent)
    FullEvents.save(fullEvent).then(newDoc => {
      fullEvent._id = newDoc._id
    })
  }
}