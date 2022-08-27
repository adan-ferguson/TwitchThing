import DungeonRuns from '../collections/dungeonRuns.js'
import Adventurers from '../collections/adventurers.js'
import AdventurerInstance from '../../game/adventurerInstance.js'
import Users from '../collections/users.js'
import DungeonRunInstance from './dungeonRunInstance.js'
import { emit } from '../socketServer.js'

let running = false
let lastAdvancement = new Date()
let activeRuns = {}

export const ADVANCEMENT_INTERVAL = 5000

export function cancelAllRuns(){
  activeRuns = {}
}

export async function start(){

  if(running){
    return
  }

  running = true
  const dungeonRuns = await DungeonRuns.find({
    query: {
      finished: false
    }
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
      console.log('Dungeon run in limbo, no user')
      return
    }
    activeRuns[dr._id] = new DungeonRunInstance(dr, user)
  })

  advance()
}

async function advance(){
  const before = new Date()
  await advanceRuns()
  emitSocketEvents()
  await saveAllRuns()
  clearFinishedRuns()

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
    ...dungeonOptions
  }

  const adventurer = await Adventurers.findByID(adventurerID)
  const startingFloor = parseInt(dungeonOptions.startingFloor) || 1
  const userDoc = await Users.findByID(adventurer.userID)
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

export function getAllActiveRuns(truncated = false){
  return Object.values(activeRuns).map(activeRun => truncated ? truncatedRun(activeRun) : activeRun)
}

export function getActiveRunData(dungeonRunID){
  const run = activeRuns[dungeonRunID]
  if(!run){
    return null
  }
  const runDoc = { ...run.doc }
  runDoc.virtualTime = virtualTime(run)
  return runDoc
}

export async function getRunData(dungeonRunID){
  return getActiveRunData(dungeonRunID) || await DungeonRuns.findByID(dungeonRunID)
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


async function advanceRuns(){
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
}

function emitSocketEvents(){
  const perUser = {}
  const liveMap = []

  activeRuns.forEach(dri => {
    const truncated = truncatedRun(dri)
    emit(truncated._id, 'dungeon run update', truncated)
    if(!perUser[truncated.adventurer.userID]){
      perUser[truncated.adventurer.userID] = []
    }
    perUser[truncated.adventurer.userID].push(truncated)
    liveMap.push(truncated)
  })

  Object.keys(perUser).forEach(userID => {
    emit(userID, 'user dungeon run update', perUser[userID])
  })

  emit('live dungeon map', 'live dungeon map update', liveMap)
}

async function saveAllRuns(){
  const docs = activeRuns.map(r => r.doc)
  await DungeonRuns.saveMany(docs)
}

function clearFinishedRuns(){
  activeRuns.filter(r => r.finished)
    .forEach(r => {
      delete activeRuns[r._id]
    })
}

/**
 * @param dri {DungeonRunInstance}
 * @returns {object}
 */
function truncatedRun(dri){
  const truncatedDoc = {
    ...dri.doc,
    currentEvent: dri.currentEvent,
    virtualTime: virtualTime(dri)
  }
  delete truncatedDoc.events
  return truncatedDoc
}

function virtualTime(dri){
  return dri.time + (new Date() - lastAdvancement)
}