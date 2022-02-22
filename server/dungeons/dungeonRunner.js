import * as DungeonRuns from '../collections/dungeonRuns.js'
import { advanceVentures } from './ventures.js'

const TICK_TIME = 2000

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
  return await DungeonRuns.create(adventurerID, dungeonID)
}

async function advanceAllRuns(){

  if(!running){
    return
  }

  process.stdout.write('.')
  const runs = await DungeonRuns.loadAllInProgress()
  // TODO: calculate inter-adventurer encounters
  for (const run of runs){
    try {
      await DungeonRuns.advance(run)
    }catch(e){
      console.error(e)
      process.exit()
    }


  setTimeout(() => {
    advanceAllRuns()
  }, TICK_TIME)
}