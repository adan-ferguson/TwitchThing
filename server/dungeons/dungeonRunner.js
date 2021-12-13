import * as DungeonRuns from '../collections/dungeonRuns.js'
import { runFinished } from './ventures.js'

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
  return run.id
}

async function advanceAllRuns(){

  if(!running){
    return
  }

  const runs = await DungeonRuns.loadAllInProgress()

  setTimeout(() => {
    advanceAllRuns()
  }, TICK_TIME)
}