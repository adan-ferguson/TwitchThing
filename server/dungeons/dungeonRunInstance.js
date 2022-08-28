import { EventEmitter } from 'events'
import AdventurerInstance from '../../game/adventurerInstance.js'
import { finishCombatEvent } from '../combat/combat.js'
import { continueRelicEvent } from './relics.js'
import { generateEvent } from './dungeonEventPlanner.js'
import { addRewards } from './results.js'
import { ADVANCEMENT_INTERVAL } from './dungeonRunner.js'

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

  get adventurerInstance(){
    return new AdventurerInstance(this.adventurer, this.doc.adventurerState)
  }

  get nextEventTime(){
    return this.currentEvent ? this.currentEvent.time + this.currentEvent.duration : 0
  }

  get pace(){
    return this.doc.dungeonOptions.pace ?? 'Brisk'
  }

  async advance(nextEvent){

    if(this._time + ADVANCEMENT_INTERVAL < this.nextEventTime){
      this._time += ADVANCEMENT_INTERVAL
      return
    }else{
      this._time = this.nextEventTime
    }

    if(this.currentEvent?.runFinished){
      return this._finish()
    }

    if(this.currentEvent?.stayInRoom){
      await this._continueEvent(this.currentEvent)
    }else if(nextEvent){
      this._addEvent(nextEvent)
    }else{
      await this._nextRoom()
    }

    this._resolveEvent(this.currentEvent)

    if(this.events.length === 1){
      this.emit('started')
    }
  }

  async _continueEvent(event){
    if(event.combatID){
      this._addEvent(await finishCombatEvent(this, event))
    }else if(event.relic){
      this._addEvent(await continueRelicEvent(this, event))
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
    // Make it a multiple of the advancement interval
    nextEvent.duration = Math.ceil(-0.01 + nextEvent.duration / ADVANCEMENT_INTERVAL) * ADVANCEMENT_INTERVAL
    this.doc.room = nextEvent.room
    this.doc.floor = nextEvent.floor
    this.doc.events.push(nextEvent)
  }

  async _resolveEvent(event){
    if(event.rewards){
      if(event.rewards.xp){
        event.rewards.xp = Math.ceil(event.rewards.xp)
      }
      this.doc.rewards = addRewards(this.doc.rewards, event.rewards)
    }
    event.duration = Math.ceil(event.duration / ADVANCEMENT_INTERVAL) * ADVANCEMENT_INTERVAL
    event.adventurerState = this._passTime(event)
    this.doc.adventurerState = event.adventurerState
    this.doc.elapsedTime += event.duration
  }

  _finish(){
    console.log('run finished', this.adventurer.name)
    this.doc.finished = true
  }

  /**
   * Reduce cooldowns of actives, tick buffs/debuffs, perform regeneration, etc
   * @private
   * @param event
   */
  _passTime(event){
    let state = event.adventurerState || this.doc.adventurerState
    if (!event.passTimeOverride){ // Combats handle their own passage of time.
      const adv = new AdventurerInstance(this.adventurer, state)
      adv.passTime(event.duration)
      // TODO: this might affect the event in other ways, such as ending the run if the adventurer dies
      return adv.adventurerState
    }
    return state
  }
}