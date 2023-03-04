import DungeonRuns from '../collections/dungeonRuns.js'
import Adventurers from '../collections/adventurers.js'
import Users from '../collections/users.js'
import DungeonRunInstance from './dungeonRunInstance.js'
import { emit } from '../socketServer.js'
import { cancelRun } from './results.js'
import AdventurerInstance from '../../game/adventurerInstance.js'

let lastAdvancement = new Date()
let running = false
let activeRuns = {}

export const ADVANCEMENT_INTERVAL = 2500

export function cancelAllRuns(){
  activeRuns = {}
}

export async function start(){

  if(running){
    return
  }

  running = true
  console.log('starting dungeon runner')
  const dungeonRuns = await DungeonRuns.find({
    query: {
      finished: false
    }
  })
  console.log(`found ${dungeonRuns.length} runs`)
  const adventurers = await Adventurers.findByIDs(dungeonRuns.map(dr => dr.adventurer._id))
  const users = await Users.findByIDs(adventurers.map(adv => adv.userID))

  dungeonRuns.forEach(dr => {
    const adventurer = adventurers.find(adv => adv._id.equals(dr.adventurer._id))
    console.log(`starting ${adventurer.name}'s run`)
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
      console.log('Dungeon run in limbo, no user')
      return
    }
    activeRuns[dr._id] = new DungeonRunInstance(dr, user)
  })

  console.log('go!')
  advance()
}

async function advance(){

  const before = new Date()

  if(Object.keys(activeRuns).length){
    emitSocketEvents()
    clearFinishedRuns()
    await advanceRuns()
    await saveAllRuns()
  }

  lastAdvancement = before
  let waitFor = ADVANCEMENT_INTERVAL - (new Date() - before)
  if(waitFor < 0){
    waitFor = ADVANCEMENT_INTERVAL
    console.log('Dungeon Run advancement took longer than 5 seconds, probably something is wrong.')
  }
  setTimeout(advance, waitFor)
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
    restThreshold: null,
    ...dungeonOptions
  }

  const adventurer = await Adventurers.findByID(adventurerID)
  const startingFloor = parseInt(dungeonOptions.startingFloor) || 1
  const userDoc = await Users.findByID(adventurer.userID)
  validateNew(adventurer, userDoc, dungeonOptions)

  const drDoc = await DungeonRuns.save({
    adventurer,
    dungeonOptions,
    floor: startingFloor,
    startTime: Date.now()
  })

  adventurer.dungeonRunID = drDoc._id
  await Adventurers.save(adventurer)

  activeRuns[drDoc._id] = new DungeonRunInstance(drDoc, userDoc)
  await activeRuns[drDoc._id].initialize()
  return drDoc
}

export async function getRunDataMulti(dungeonRunIDs){
  const runs = []
  for(let i = 0; i < dungeonRunIDs.length; i++){
    runs.push(await getRunData(dungeonRunIDs[i]))
  }
  return runs
}

export function getAllActiveRuns(truncated = false){
  return Object.values(activeRuns).map(activeRun => truncated ? truncatedRun(activeRun.doc) : activeRun.doc)
}

export function getActiveRunData(dungeonRunID){
  const run = activeRuns[dungeonRunID]
  if(!run){
    return null
  }
  return {
    ...run.doc,
    virtualTime: virtualTime(run.doc)
  }
}

export async function getRunData(dungeonRunID, truncated = false){
  const data = getActiveRunData(dungeonRunID) || await DungeonRuns.findByID(dungeonRunID)
  if(truncated){
    return truncatedRun(data)
  }
  return data
}

export function getActiveRun(id){
  return activeRuns[id]
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
  const adventurer = new AdventurerInstance(adventurerDoc)
  if(!adventurer.isLoadoutValid){
    throw 'Adventurer has invalid loadout.'
  }
}

async function advanceRuns(){
  for(const id in activeRuns){
    const run = activeRuns[id]
    try {
      await run.advance()
    }catch(ex){
      console.log('run cancelled', run.doc._id, ex)
      emit(run.doc._id, 'dungeon run update', {
        error: ex.message ?? ex,
        _id: run.doc._id
      })
      cancelRun(run.doc)
      delete activeRuns[id]
    }
  }
}

function emitSocketEvents(){
  const perUser = {}
  const liveMap = []

  Object.values(activeRuns).forEach(dri => {
    if(!dri.shouldEmit){
      return
    }
    const clipped = {
      ...dri.doc,
      newEvents: dri.getNewEvents(),
      virtualTime: virtualTime(dri.doc)
    }
    delete clipped.events

    emit(clipped._id, 'dungeon run update', clipped)
    if(!perUser[clipped.adventurer.userID]){
      perUser[clipped.adventurer.userID] = []
    }
    perUser[clipped.adventurer.userID].push(clipped)
    liveMap.push(clipped)
  })

  Object.keys(perUser).forEach(userID => {
    emit('user all adventurers ' + userID, 'user dungeon run update', perUser[userID])
  })

  emit('live dungeon map', 'live dungeon map update', liveMap)
}

async function saveAllRuns(){
  const docs = Object.values(activeRuns).map(r => r.doc)
  await DungeonRuns.saveMany(docs)
}

function clearFinishedRuns(){
  Object.values(activeRuns).filter(r => r.doc.finished)
    .forEach(r => {
      delete activeRuns[r.doc._id.toString()]
    })
}

/**
 * @param doc {object}
 * @returns {object}
 */
function truncatedRun(doc){
  const truncatedDoc = {
    ...doc,
    currentEvent: doc.events.at(-1),
    virtualTime: virtualTime(doc)
  }
  delete truncatedDoc.events
  return truncatedDoc
}

function virtualTime(doc){
  return doc.elapsedTime + (new Date() - lastAdvancement) - ADVANCEMENT_INTERVAL
}