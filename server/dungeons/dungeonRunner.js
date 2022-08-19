import DungeonRuns from '../collections/dungeonRuns.js'
import Adventurers from '../collections/adventurers.js'
import { addRewards } from './results.js'
import { generateEvent } from './dungeonEventPlanner.js'
import { emit } from '../socketServer.js'
import AdventurerInstance from '../../game/adventurerInstance.js'
import Users from '../collections/users.js'
import log from 'fancy-log'
import { continueRelicEvent } from './relics.js'
import { finishCombatEvent } from '../combat/combat.js'
import { EventEmitter } from 'events'

const ADVANCEMENT_INTERVAL = 5000

let running = false
let lastAdvancement = new Date()
let activeRuns = {}

export function cancelAllRuns(){
  activeRuns = {}
}

export async function start(){

  if(running){
    return
  }

  running = true
  const dungeonRuns = await DungeonRuns.find({
    finished: false
  })
  const adventurers = await Adventurers.findByIDs(dungeonRuns.map(dr => dr.adventurer._id))
  const users = await Users.findByIDs(adventurers.map(adv => adv.userID))

  dungeonRuns.forEach(dr => {
    const adventurer = adventurers.find(adv => adv._id.equals(dr.adventurer._id))
    if(!adventurer || !adventurer.dungeonRunID?.equals(dr._id)){
      dr.finished = true
      DungeonRuns.save(dr)
      console.error('Dungeon run in limbo, no adventurer')
      return
    }
    const user = users.find(user => user._id.equals(adventurer.userID))
    if(!user){
      dr.finished = true
      DungeonRuns.save(dr)
      log('Dungeon run in limbo, no user')
      return
    }
    activeRuns[dr._id] = new DungeonRunInstance(dr, user)
  })

  advance()
}

async function advance(){
  const numRuns = Object.keys(activeRuns).length
  if(numRuns){
    console.log('advancing, number of runs:', numRuns)
  }
  lastAdvancement = new Date()
  for(const id in activeRuns){
    const run = activeRuns[id]
    try {
      if(!run.started){
        await run.advance({
          passTimeOverride: true,
          duration: ADVANCEMENT_INTERVAL,
          message: `${run.adventurer.name} enters the dungeon.`,
          roomType: 'entrance'
        })
        run.emit('started')
      }else{
        await run.advance()
      }
    }catch(ex){
      console.log('Run suspended due to error', run.doc, ex)
      delete activeRuns[id]
    }
  }
  setTimeout(advance, ADVANCEMENT_INTERVAL)
}

/**
 * Start a dungeons run. It's assumed that all of the error-checking has been done beforehand
 * and that this is a reasonable request. This should only be called from the Ventures file.
 * @param adventurerID
 * @param dungeonOptions
 */
export async function addRun(adventurerID, dungeonOptions){

  dungeonOptions = {
    startingFloor: 1,
    pace: 'Brisk',
    ...dungeonOptions
  }

  const adventurer = await Adventurers.findOne(adventurerID)
  const startingFloor = parseInt(dungeonOptions.startingFloor) || 1
  const userDoc = await Users.findOne(adventurer.userID)
  validateNew(adventurer, userDoc, dungeonOptions)

  const drDoc = await DungeonRuns.save({
    adventurer,
    dungeonOptions,
    adventurerState: AdventurerInstance.initialState(adventurer),
    floor: startingFloor
  })

  adventurer.dungeonRunID = drDoc._id
  await Adventurers.save(adventurer)

  const instance = new DungeonRunInstance(drDoc, userDoc)
  activeRuns[drDoc._id] = instance

  await new Promise(res => {
    instance.once('started', res)
  })
  return drDoc
}

export async function getRunDataMulti(dungeonRunIDs){
  const runs = []
  for(let i = 0; i < dungeonRunIDs.length; i++){
    runs.push(await getRunData(dungeonRunIDs[i]))
  }
  return runs
}

export function getActiveRunData(dungeonRunID){
  const run = activeRuns[dungeonRunID]
  if(!run){
    return null
  }
  const runDoc = { ...run.doc }
  runDoc.virtualTime = run.virtualTime
  return runDoc
}

export async function getRunData(dungeonRunID){
  return getActiveRunData(dungeonRunID) || await DungeonRuns.findOne(dungeonRunID)
}

class DungeonRunInstance extends EventEmitter{

  constructor(doc, user){
    super()
    this.doc = doc
    if(!this.adventurer.userID.equals(user._id)){
      throw 'User mismatch in dungeonRun instance'
    }
    this.user = user
    this._time = this.currentEvent?.time ?? 0
  }

  get adventurer(){
    return this.doc.adventurer
  }

  get virtualTime(){
    return this._time + (new Date() - lastAdvancement)
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

    const truncatedDoc = {
      ...this.doc,
      currentEvent: this.currentEvent,
      virtualTime: this.virtualTime
    }

    delete truncatedDoc.events
    emit(this.adventurer.userID, 'user dungeon run update', truncatedDoc)
    emit(this.doc._id, 'dungeon run update', truncatedDoc)
    DungeonRuns.save(this.doc)
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
    delete activeRuns[this.doc._id]
    DungeonRuns.save(this.doc)
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

function validateNew(adventurerDoc, userDoc, { startingFloor }){
  if(!adventurerDoc){
    throw 'Adventurer not found'
  }
  if(startingFloor > adventurerDoc.accomplishments.deepestFloor){
    throw 'Invalid starting floor'
  }
  if(adventurerDoc.dungeonRun){
    throw 'Adventurer already in dungeon'
  }
  if(adventurerDoc.nextLevelUp){
    throw 'Adventurer can not enter dungeon, they have a pending levelup'
  }
}