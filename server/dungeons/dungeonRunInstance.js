import { EventEmitter } from 'events'
import { generateEvent } from './dungeonEventPlanner.js'
import { addRewards } from './results.js'
import { ADVANCEMENT_INTERVAL } from './dungeonRunner.js'
import calculateResults from '../../game/dungeonRunResults.js'
import { arrayize } from '../../game/utilFunctions.js'
import AdventurerInstance from '../../game/adventurerInstance.js'
import { resumeCombatEvent } from '../combat/fns.js'
import { useAbility } from '../mechanics/actions/performAction.js'

export default class DungeonRunInstance extends EventEmitter{

  shouldEmit = false
  _lastAdvancement = new Date()
  _instructions = {
    leave: false
  }

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
    if(this.newestEvent){
      if(this.newestEvent.pending){
        return Number.POSITIVE_INFINITY
      }
      return this.newestEvent.time + this.newestEvent.duration
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
    this.doc.events = [{
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

    if(this.newestEvent.runFinished){
      this.doc.results = calculateResults(this.events)
      this.doc.finished = true
      this.doc.elapsedTime = this.nextEventTime
      return
    }

    await this._nextEvent()
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

  finishRunningCombat(newCombatEvent, resultEvent){
    this.shouldEmit = true
    this.events.pop()
    this._addEvent([newCombatEvent, resultEvent])
  }

  resumePending(){
    if(this.newestEvent?.pending){
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
    this.doc.room = this.newestEvent?.nextRoom || this.doc.room
    this.doc.floor = this.newestEvent?.nextFloor || this.doc.floor
    this._addEvent(await generateEvent(this))
  }

  async _addEvent(events){

    events = arrayize(events)
    let durationSum = 0
    let startTime = events[0].time ?? this.doc.elapsedTime
    events.forEach((e, i) => {
      const nextEvent = {
        room: this.doc.room,
        floor: this.doc.floor,
        time: startTime + durationSum,
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
      if(i === events.length - 1){
        if(!nextEvent.runFinished){
          nextEvent.duration += (ADVANCEMENT_INTERVAL - (durationSum % ADVANCEMENT_INTERVAL)) % ADVANCEMENT_INTERVAL
        }
        this.doc.room = nextEvent.room
        this.doc.floor = nextEvent.floor
      }
      this._updateState(nextEvent)
    })

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
    let time = this.events[0].time
    for(let i in this.events){
      const entry = this.events[i]
      entry.time = time
      time += entry.duration
    }
  }
}