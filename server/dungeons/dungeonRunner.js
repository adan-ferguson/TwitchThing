import DungeonRuns from '../collections/dungeonRuns.js'
import Adventurers from '../collections/adventurers.js'
import Users from '../collections/users.js'
import DungeonRunInstance from './dungeonRunInstance.js'
import { emit } from '../socketServer.js'
import Adventurer from '../../game/adventurer.js'
import ConsoleTimer from '../../game/consoleTimer.js'
import FullEvents from '../collections/fullEvents.js'

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
      finished: false,
      cancelled: {
        $ne: true
      }
    }
  })
  console.log(`found ${dungeonRuns.length} runs`)
  const adventurers = await Adventurers.findByIDs(dungeonRuns.map(dr => dr.adventurer._id))
  const users = await Users.findByIDs(adventurers.map(adv => adv.userID))

  for(let dr of dungeonRuns){
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
    await activeRuns[dr._id].resume()
  }

  console.log('go!')
  advance()
}

async function advance(){

  const before = new Date()
  const timer = new ConsoleTimer()

  if(Object.keys(activeRuns).length){
    timer.reset()
    console.log('--------------------')
    timer.log(`Advancing ${Object.keys(activeRuns).length} runs.`)
    emitSocketEvents()
    timer.log('Emitted socket events')
    clearFinishedRuns()
    timer.log('Cleared finished runs')
    await advanceRuns()
    timer.log('Advanced runs')
    saveAllRuns()
    timer.log('Saved runs')
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

  const advDoc = await Adventurers.findByID(adventurerID)
  const startingFloor = parseInt(dungeonOptions.startingFloor) || 1
  const userDoc = await Users.findByID(advDoc.userID)
  validateNew(advDoc, userDoc, dungeonOptions)

  const drDoc = await DungeonRuns.save({
    adventurer: advDoc,
    dungeonOptions,
    floor: startingFloor,
    startTime: Date.now(),
    version: DungeonRuns.CURRENT_VERSION,
  })

  advDoc.dungeonRunID = drDoc._id
  advDoc.state.canRefundForFree = false
  await Adventurers.save(advDoc)

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

export function getAllActiveRuns(){
  return Object.values(activeRuns).map(run => {
    const doc = run.doc
    return {
      ...doc,
      virtualTime: virtualTime(doc),
      events: run.events.slice(-3).map(e => e.data)
    }
  })
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

export async function getRunData(dungeonRunID){

  let newestEvents
  let doc
  if(activeRuns[dungeonRunID]){
    doc = activeRuns[dungeonRunID].doc
    newestEvents = activeRuns[dungeonRunID].events.slice(-3)
  }else{
    doc = await DungeonRuns.findByID(dungeonRunID)
    if(!doc){
      throw 'Invalid dungeonRunID ' + dungeonRunID
    }
    newestEvents = await FullEvents.collection.find({
      dungeonRunID
    }).sort({ 'data.time': -1 }).limit(3).toArray()
    newestEvents = newestEvents.reverse()
  }

  return {
    ...doc,
    virtualTime: virtualTime(doc),
    events: newestEvents.map(e => e.data),
  }
}

export function getActiveRun(id){
  return activeRuns[id]
}

export async function cancelRun(dungeonRunDoc, ex){
  if(!activeRuns[dungeonRunDoc._id]){
    return
  }
  delete activeRuns[dungeonRunDoc._id]
  console.log('run cancelled', dungeonRunDoc._id)
  emit(dungeonRunDoc._id, 'dungeon run update', {
    id: dungeonRunDoc._id,
    error: ex?.message ?? ex
  })
  const adventurerDoc = await Adventurers.findByID(dungeonRunDoc.adventurer._id)
  adventurerDoc.dungeonRunID = null
  dungeonRunDoc.cancelled = true
  await Adventurers.save(adventurerDoc)
  await DungeonRuns.save(dungeonRunDoc)
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
  const adventurer = new Adventurer(adventurerDoc)
  if(!adventurer.isValid){
    throw 'Adventurer has invalid loadout.'
  }
}

async function advanceRuns(){
  for(const id in activeRuns){
    const run = activeRuns[id]
    try {
      await run.advance()
    }catch(ex){
      cancelRun(run.doc, ex)
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
      newEvents: dri.getNewEvents().map(e => e.data),
      virtualTime: virtualTime(dri.doc)
    }

    emit(clipped._id, 'dungeon run update', { id: clipped._id, dungeonRun: clipped })
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
  const start = Date.now()
  await DungeonRuns.saveMany(docs)
  console.log(Date.now() - start, 'saveMany docs time')
}

function clearFinishedRuns(){
  Object.values(activeRuns).filter(r => r.doc.finished)
    .forEach(r => {
      delete activeRuns[r.doc._id.toString()]
    })
}

export function virtualTime(doc){
  return doc.elapsedTime + (new Date() - lastAdvancement) - ADVANCEMENT_INTERVAL
}