import * as DungeonRuns from '../collections/dungeonRuns.js'
import { advanceVentures } from './ventures.js'
import { generateEvent } from './eventPlanner.js'
import { emit } from '../socketServer.js'
import { findOne } from '../collections/adventurers.js'

const TICK_TIME = 5000

let running = false
export function start(){
  if(running){
    return
  }
  running = true
  advanceAllRuns()
}

/**
 * Start a dungeon run. It's assumed that all of the error-checking has been done beforehand
 * and that this is a reasonable request. This should only be called from the Ventures file.
 * @param adventurerID
 * @param dungeonID
 */
export async function addRun(adventurerID, dungeonID){
  const run = await DungeonRuns.create(adventurerID, dungeonID)
  return run._id
}

async function advanceAllRuns(){

  if(!running){
    return
  }

  process.stdout.write('.')
  const runs = await DungeonRuns.loadAllInProgress()
  await advanceVentures(runs.map(run => run._id))
  // TODO: calculate inter-adventurer encounters
  for (const run of runs) {
    await DungeonRuns.advance(run)
  }

  setTimeout(() => {
    advanceAllRuns()
  }, TICK_TIME)
}