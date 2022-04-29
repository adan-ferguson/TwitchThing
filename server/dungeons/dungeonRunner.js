import DungeonRuns from '../collections/dungeonRuns.js'
import Combats from '../collections/combats.js'
import Adventurers from '../collections/adventurers.js'
import { addRewards, calculateResults } from './results.js'
import { generateEvent } from './dungeonEventPlanner.js'
import { emit } from '../socketServer.js'
import AdventurerInstance from '../../game/adventurerInstance.js'
import Users from '../collections/users.js'

let running = false
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
  const adventurers = await Adventurers.findByIDs(dungeonRuns.map(dr => dr.adventurerID))
  const users = await Users.findByIDs(adventurers.map(adv => adv.userID))

  dungeonRuns.forEach(dr => {
    const adventurer = adventurers.find(adv => adv._id.equals(dr.adventurerID))
    if(!adventurer){
      dr.finished = true
      DungeonRuns.save(dr)
      console.error('Dungeon run in limbo, no adventurer')
      return
    }
    const user = users.find(user => user._id.equals(adventurer.userID))
    if(!user){
      dr.finished = true
      DungeonRuns.save(dr)
      console.log('Dungeon run in limbo, no user')
      return
    }
    activeRuns[dr._id] = new DungeonRunInstance(dr, adventurer, user)
  })

  advanceTime(0)

  async function advanceTime(ms){
    for(const id in activeRuns){
      const activeRun = activeRuns[id]
      activeRun.timeSinceLastEvent += ms
      if(activeRun.currentEvent.duration <= activeRun.timeSinceLastEvent){
        await activeRun.advance()
      }
    }
    const before = Date.now()
    setTimeout(() => {
      advanceTime(Date.now() - before)
    })
  }
}

/**
 * Start a dungeons run. It's assumed that all of the error-checking has been done beforehand
 * and that this is a reasonable request. This should only be called from the Ventures file.
 * @param adventurerID
 * @param dungeonOptions
 */
export async function addRun(adventurerID, dungeonOptions){

  const adventurerDoc = await Adventurers.findOne(adventurerID)

  const startingFloor = parseInt(dungeonOptions.startingFloor) || 1
  if(startingFloor > adventurerDoc.accomplishments.highestFloor || startingFloor % 10 !== 1){
    throw 'Invalid starting floor'
  }

  if(!adventurerID){
    throw 'No adventurer ID'
  }

  const userDoc = await Users.findOne(adventurerDoc.userID)
  const drDoc = await DungeonRuns.save({
    adventurerID,
    dungeonOptions,
    floor: startingFloor,
    events: [],
    adventurerState: {
      hp: adventurerDoc.baseStats.hpMax
    }
  })
  Adventurers.update(adventurerID, {
    dungeonRunID: drDoc._id
  })
  activeRuns[drDoc._id] = new DungeonRunInstance(drDoc, adventurerDoc, userDoc)
}

export async function getRunDataMulti(dungeonRunIDs){
  const runs = []
  for(let i = 0; i < dungeonRunIDs.length; i++){
    runs.push(await getRunData(dungeonRunIDs[i]))
  }
  return runs
}

export async function getRunData(dungeonRunID){
  const run = activeRuns[dungeonRunID]
  if(!run){
    return await DungeonRuns.findOne(dungeonRunID)
  }
  const runDoc = { ...run.doc }
  runDoc.virtualTime = run.virtualTime
  return runDoc
}

class DungeonRunInstance{

  constructor(doc, adventurer, user){
    this.doc = doc
    this.adventurer = adventurer
    this.user = user
    this.timeSinceLastEvent = 0
    if(!this.currentEvent){
      this.advance({
        message: `${this.adventurer.name} enters the dungeon.`
      })
    }
  }

  get virtualTime(){
    return this.currentEvent.startTime + this.timeSinceLastEvent
  }

  get floor(){
    return this.doc.floor
  }

  get room(){
    return this.doc.room
  }

  get events(){
    return this.doc.events
  }

  get rewards(){
    return this.doc.rewards
  }

  get currentEvent(){
    return this.doc.events.at(-1)
  }

  get adventurerInstance(){
    return new AdventurerInstance(this.adventurer, this.doc.adventurerState)
  }

  async loadAdventurer(){
    return this.adventurer = await Adventurers.findOne(this.doc.adventurerID)
  }

  async advance(nextEvent){
    process.stdout.write(this.doc.floor + '')

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
    this.doc.room = this.currentEvent?.nextRoom || this.doc.room + 1
    this.doc.floor = this.currentEvent?.nextFloor || this.doc.floor
    const nextEvent = {
      room: this.doc.room,
      floor: this.doc.floor,
      startTime: this.doc.elapsedTime,
      duration: this.adventurerInstance.standardRoomDuration,
      ...event
    }
    this.doc.events.push(nextEvent)
    this.timeSinceLastEvent = 0
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
    const fighter = combat.fighter1.data._id.equals(this.doc.adventurerID) ? combat.fighter1 : combat.fighter2
    const enemy = combat.fighter1.data._id.equals(this.doc.adventurerID) ? combat.fighter2 : combat.fighter1
    if(!fighter.endState.hp){
      event.runFinished = true
      event.message = `${fighter.data.name} has fallen, and got kicked out of the dungeon by some mysterious entity.`
    }else if(!enemy.endState.hp){
      event.rewards = enemy.data.rewards
      event.message = `${fighter.data.name} defeated the ${enemy.data.name}.`
      event.monster.defeated = true
    }else{
      event.message = 'That fight was going nowhere so you both just get bored and leave.'
    }
    event.adventurerState = fighter.endState
    event.pending = false
    event.duration += 8000
  }

  _finish(){
    this.doc.finished = true
    this.doc.results = calculateResults(this)
    delete activeRuns[this.doc._id]
    emit(this.adventurer.userID, 'dungeon run update', this.doc)
    DungeonRuns.save(this.doc)
  }
}