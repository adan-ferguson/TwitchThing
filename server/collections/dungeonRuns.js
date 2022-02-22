import db from '../db.js'
import { generateEvent } from '../dungeons/dungeonEventPlanner.js'
import { emit } from '../socketServer.js'
import * as Adventurers from './adventurers.js'
import * as Combats from './combats.js'

const DEFAULTS = {
  _id: null,
  adventurerID: null,
  dungeonID: null,
  finished: false,
  floor: 1,
  room: 1,
  rewards: {},
  events: [],
  currentEvent: {
    message: 'You enter the dungeon.'
  },
  adventurerState: {}
}

const REWARDS_TYPES = {
  xp: 'int'
}

export async function save(dungeonRunDoc){
  return await db.save(fix(dungeonRunDoc), 'dungeonRuns')
}

function fix(dungeonRunDoc, projection = null){
  return db.fix(dungeonRunDoc, DEFAULTS, projection)
}

export async function create(adventurerID, dungeonID){
  return await db.save({
    ...DEFAULTS,
    adventurerID,
    dungeonID
  }, 'dungeonRuns')
}

export async function loadAllInProgress(){
  const arr = await db.conn().collection('dungeonRuns').find({
    finished: false
  }).toArray()
  return arr.map(dungeonRuns => fix(dungeonRuns))
}

export async function loadByIDs(ids){
  const arr = await db.conn().collection('dungeonRuns').find({
    _id: { $in: ids }
  }).toArray()
  return arr.map(dungeonRuns => fix(dungeonRuns))
}

export async function find(queryOrID = {}, projection = {}){
  return await db.find('dungeonRuns', queryOrID, projection, DEFAULTS)
}

export async function findOne(queryOrID = {}, projection = {}){
  return await db.findOne('dungeonRuns', queryOrID, projection, DEFAULTS)
}

export async function advance(dungeonRunDoc){

  const prevEvent = dungeonRunDoc.currentEvent
  let goToNewEvent = true
  let changesMade = false

  if(prevEvent?.waitUntil > Date.now()){
    console.log('waiting', prevEvent.waitUntil, prevEvent.waitUntil - Date.now())
    return
  }

  if (prevEvent.stairs){
    dungeonRunDoc.room = 1
    dungeonRunDoc.floor++
  }

  if (prevEvent.combat?.state === 'running'){
    if (Date.now() > prevEvent.waitUntil){
      prevEvent.combat.state = 'finished'
      await applyCombatResult(prevEvent, dungeonRunDoc.adventurerID)
      parseEvent(prevEvent, dungeonRunDoc)
      changesMade = true
    }
    goToNewEvent = false
  }

  if (goToNewEvent){
    await newEvent(dungeonRunDoc)
    changesMade = true
  }

  // TODO: more detail in this one
  if(changesMade){
    emit(dungeonRunDoc.adventurerID, 'dungeon run update', dungeonRunDoc)
    await save(dungeonRunDoc)
  }
}

export function addRewards(rewards, toAdd){
  for(let key in toAdd){

    if(!(key in REWARDS_TYPES)){
      continue
    }

    if(REWARDS_TYPES[key] === 'int'){
      if(!rewards[key]){
        rewards[key] = 0
      }
      rewards[key] += toAdd[key]
    }else if(REWARDS_TYPES[key] === 'array'){
      if(!rewards[key]){
        rewards[key] = []
      }
      rewards[key].push(toAdd[key])
    }
  }
}

async function newEvent(dungeonRunDoc){

  const adventurer = await Adventurers.findOne(dungeonRunDoc.adventurerID)
  const nextEvent = await generateEvent(adventurer, dungeonRunDoc)

  nextEvent.room = dungeonRunDoc.room
  nextEvent.floor = dungeonRunDoc.floor

  parseEvent(nextEvent, dungeonRunDoc)

  dungeonRunDoc.events.push(nextEvent)
  dungeonRunDoc.currentEvent = nextEvent
  dungeonRunDoc.room++
}

function parseEvent(event, dungeonRunDoc){
  if(event.adventurerState){
    dungeonRunDoc.adventurerState = event.adventurerState
  }
  if(event.rewards){
    addRewards(dungeonRunDoc.rewards, event.rewards)
  }
  if(event.finished){
    dungeonRunDoc.finished = true
  }
}

async function applyCombatResult(combatEvent, myAdventurerID){
  const combat = await Combats.findOne(combatEvent.combat.combatID)
  const fighter = combat.fighter1.data._id.equals(myAdventurerID) ? combat.fighter1 : combat.fighter2
  const enemy = combat.fighter1.data._id.equals(myAdventurerID) ? combat.fighter2 : combat.fighter1
  if(!fighter.endState.hp){
    combatEvent.finished = true
    combatEvent.message = `${fighter.data.name} has fallen, and got kicked out of the dungeon by some mysterious entity.`
  }else{
    combatEvent.rewards = enemy.data.rewards
    combatEvent.message = `${fighter.data.name} defeated the ${enemy.data.name}.`
  }
  combatEvent.adventurerState = fighter.endState
  combatEvent.waitUntil = Date.now() + 8000
}