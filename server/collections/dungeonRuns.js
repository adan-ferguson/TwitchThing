import db from '../db.js'
import { generateEvent } from '../dungeons/eventPlanner.js'
import { emit } from '../socketServer.js'
import * as Adventurers from './adventurers.js'

const DEFAULTS = {
  _id: null,
  adventurerID: null,
  dungeonID: null,
  finished: false,
  floor: 1,
  room: 1,
  rewards: {
    xp: 0
  },
  events: [],
  currentEvent: {
    message: 'You enter the dungeon.'
  },
  adventurerState: {}
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
  }).sort({ dungeonID: 1 })
    .toArray()
  return arr.map(dungeonRuns => fix(dungeonRuns))
}

export async function find(queryOrID = {}, projection = {}){
  return db.find('dungeonRuns', queryOrID, projection, DEFAULTS)
}

export async function findOne(queryOrID = {}, projection = {}){
  return db.findOne('dungeonRuns', queryOrID, projection, DEFAULTS)
}

export async function advance(dungeonRunDoc){

  const adventurer = await Adventurers.findOne(dungeonRunDoc.adventurerID)

  const newEvent = await generateEvent(adventurer, dungeonRunDoc)

  if(!newEvent) {
    // Nothing happened, perhaps we're resting or in combat.
    return
  }

  dungeonRunDoc.room++
  dungeonRunDoc.events.push(newEvent)
  dungeonRunDoc.currentEvent = newEvent

  if(newEvent.rewards){
    addRewards(dungeonRunDoc.rewards, newEvent.rewards)
  }

  if(newEvent.finished){
    dungeonRunDoc.finished = true
  }

  // TODO: more detail in this one
  emit(dungeonRunDoc.adventurerID, 'dungeon run update', dungeonRunDoc)

  await save(dungeonRunDoc)
}

function addRewards(rewards, toAdd){
  for(let key in toAdd){
    if(key in rewards){
      if(Number.isInteger(rewards[key])){
        rewards[key] += toAdd[key]
      }else if(Array.isArray(rewards[key])) {
        rewards[key].push(toAdd[key])
      }
    }
  }
}