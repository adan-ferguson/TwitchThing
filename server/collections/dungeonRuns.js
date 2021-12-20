import db from '../db.js'
import { loadData } from './adventurers.js'
import { generateEvent } from '../dungeons/eventPlanner.js'
import { emit } from '../socketServer.js'

const DEFAULTS = {
  _id: null,
  adventurerID: null,
  dungeonID: null,
  finished: false,
  // floor: 1,
  // rewards: {},
  events: [],
  // adventurerState: {}
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

export async function advance(dungeonRunDoc){
  const adventurer = await loadData(dungeonRunDoc.adventurerID)

  // TODO: provide more detail here
  const event = await generateEvent(dungeonRunDoc)

  dungeonRunDoc.events.push(event)
  if(event.finished){
    dungeonRunDoc.finished = true
  }

  // TODO: more detail in this one
  emit(dungeonRunDoc.adventurerID, 'dungeon run event', event)

  // TODO: less detail in this one
  emit(adventurer.userid, 'adventurer update', { dungeonRunDoc, event })

  await save(dungeonRunDoc)
}