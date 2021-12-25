import { addRun } from './dungeonRunner.js'
import * as Adventurers from '../collections/adventurers.js'
import { emit } from '../socketServer.js'

export async function getByAdventurerID(adventurerID){
  const data = await Adventurers.findOne(adventurerID, {
    currentVenture: 1
  })
  return data.currentVenture
}

// TODO: more options
export async function beginVenture(adventurerID, dungeonID){

  if(await getByAdventurerID(adventurerID)){
    throw { code: 401, error: 'Can not enter dungeon, adventurer is already venturing.' }
  }

  // TODO: check if adventurer is allowed to run this dungeon

  const venture = {
    adventurerID,
    dungeonID,
    finished: false,
    plan: {
      type: 'count',
      current: 0,
      limit: 1
    },
    currentRun: null,
    finishedRuns: []
  }

  continueVenture(venture)
}

async function continueVenture(venture){

  if(venture.currentRun){
    venture.finishedRuns.push(venture.currentRun)
    venture.currentRun = null
  }

  let shouldStop = false
  if(venture.plan.type === 'count'){
    if(venture.plan.current >= venture.plan.limit){
      shouldStop = true
    }else{
      venture.plan.current++
    }
  }else if(venture.plan.type === 'time'){
    // TODO this
  }

  if(shouldStop){
    venture.finished = true
  }else{
    venture.currentRun = await addRun(venture.adventurerID, venture.dungeonID)
  }

  await Adventurers.update(venture.adventurerID, { currentVenture: venture })
  emit(venture.adventurerID, 'venture update', venture)
}

export async function runFinished(runID, adventurerID){
  const venture = await getByAdventurerID(adventurerID)
  if(!venture || !runID.equals(venture.currentRun)){
    // TODO: huh?
    return
  }
  venture.finishedRuns.push(venture.currentRun)
  venture.currentRun = null
  continueVenture(venture)
}

/**
 * Advance ventures that:
 * - Have no currentRun
 * - Have a currentRun that's not in progress
 * @param runsInProgress [id]
 * @returns {Promise<void>}
 */
export async function advanceVentures(runsInProgress){
  const runsObj = {}
  runsInProgress.forEach(runID => runsObj[runID.toString()] = 1)

  const ventures = await Adventurers.loadRunningVentures()
  for(let i = 0; i < ventures.length; i++){
    let venture = ventures[i]
    if(!venture.currentRun || !runsObj[venture.currentRun.toString()]){
      await continueVenture(venture)
    }
  }
}