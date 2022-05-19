import DungeonRuns from '../collections/dungeonRuns.js'
import Combats from '../collections/combats.js'
import Adventurers from '../collections/adventurers.js'
import { addRewards } from './results.js'
import { generateEvent } from './dungeonEventPlanner.js'
import { emit } from '../socketServer.js'
import AdventurerInstance from '../../game/adventurerInstance.js'
import Users from '../collections/users.js'
import { toDisplayName } from '../../game/utilFunctions.js'
import { levelToHp, levelToPower } from '../../game/adventurer.js'
import log from 'fancy-log'

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
    await activeRuns[id].advance()
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

  const adventurer = await Adventurers.findOne(adventurerID)

  const startingFloor = parseInt(dungeonOptions.startingFloor) || 1
  if(startingFloor > adventurer.accomplishments.highestFloor || startingFloor % 10 !== 1){
    throw 'Invalid starting floor'
  }
  if(!adventurerID){
    throw 'No adventurer ID'
  }

  adventurer.baseHp = levelToHp(adventurer.level)
  adventurer.basePower = levelToPower(adventurer.level)

  const userDoc = await Users.findOne(adventurer.userID)
  const drDoc = await DungeonRuns.save({
    adventurer,
    dungeonOptions,
    adventurerState: AdventurerInstance.initialState(adventurer),
    floor: startingFloor
  })
  adventurer.dungeonRunID = drDoc._id
  await Adventurers.save(adventurer)
  activeRuns[drDoc._id] = new DungeonRunInstance(drDoc, userDoc)
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

class DungeonRunInstance{

  constructor(doc, user){
    this.doc = doc
    if(!this.adventurer.userID.equals(user._id)){
      throw 'User mismatch in dungeonRun instance'
    }
    this.user = user
    if(!this.currentEvent){
      this.advance({
        message: `${this.adventurer.name} enters the dungeon.`
      })
    }
  }

  get adventurer(){
    return this.doc.adventurer
  }

  get virtualTime(){
    return this.currentEvent.startTime + (new Date() - lastAdvancement)
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

  get adventurerInstance(){
    return new AdventurerInstance(this.adventurer, this.doc.adventurerState)
  }

  async advance(nextEvent){

    if(this.currentEvent?.runFinished){
      return this._finish()
    }

    if(this.currentEvent?.pending){
      await this._continueEvent(this.currentEvent)
    }else if(nextEvent){
      this._addEvent(nextEvent)
    }else{
      await this._newEvent()
    }

    if(!this.currentEvent.pending){
      this._resolveEvent(this.currentEvent)
    }

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
      await this._applyCombatResult(event)
    }
  }

  async _newEvent(){
    this._addEvent(await generateEvent(this))
  }

  async _addEvent(event){
    const nextEvent = {
      room: this.currentEvent?.nextRoom || this.doc.room + 1,
      floor: this.currentEvent?.nextFloor || this.doc.floor,
      startTime: this.doc.elapsedTime,
      duration: this.adventurerInstance.standardRoomDuration,
      ...event
    }
    this.doc.room = nextEvent.room
    this.doc.floor = nextEvent.floor
    this.doc.events.push(nextEvent)
  }

  async _resolveEvent(event){
    if(event.adventurerState){
      this.doc.adventurerState = event.adventurerState
    }
    if(event.rewards){
      if(event.rewards.xp){
        event.rewards.xp = Math.ceil(event.rewards.xp)
      }
      this.doc.rewards = addRewards(this.doc.rewards, event.rewards)
    }
    this.doc.elapsedTime += event.duration
  }

  async _applyCombatResult(event){
    const combat = await Combats.findOne(event.combatID)
    const fighter = combat.fighter1.data._id.equals(this.adventurer._id) ? combat.fighter1 : combat.fighter2
    const enemy = combat.fighter1.data._id.equals(this.adventurer._id) ? combat.fighter2 : combat.fighter1
    if(!fighter.endState.hp){
      event.runFinished = true
      event.message = `${fighter.data.name} has fallen, and got kicked out of the dungeon by some mysterious entity.`
    }else if(!enemy.endState.hp){
      event.rewards = enemy.data.rewards
      event.message = `${fighter.data.name} defeated the ${toDisplayName(enemy.data.name)}.`
      event.monster.defeated = true
    }else{
      event.message = 'That fight was going nowhere so you both just get bored and leave.'
    }
    event.adventurerState = fighter.endState
    event.pending = false
    event.duration += 8000
  }

  _finish(){
    console.log('run finished', this.adventurer.name)
    this.doc.finished = true
    delete activeRuns[this.doc._id]
    emit(this.adventurer.userID, 'dungeon run update', this.doc)
    DungeonRuns.save(this.doc)
  }
}