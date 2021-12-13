import { addRun } from './dungeonRunner.js'
import * as Adventurers from '../collections/adventurers.js'

export async function getByAdventurerID(adventurerID){
  const data = await Adventurers.loadData(adventurerID, {
    currentVenture: 1
  })
  return data.currentVenture
}

// TODO: more options
export async function beginVenture(adventurerID, dungeonID){

  if(getByAdventurerID(adventurerID)){
    throw { code: 401, error: 'Can not enter dungeon, adventurer is already venturing.' }
  }

  // TODO: check if adventurer is allowed to run this dungeon

  const venture = {
    adventurerID,
    dungeonID,
    plan: {
      type: 'count',
      current: 0,
      limit: 1
    },
    currentRun: null,
    finishedRuns: []
  }

  Adventurers.update(adventurerID, { currentVenture: venture })
  continueVenture(venture)
}

async function continueVenture(venture){

  if(venture.currentRun){
    throw { code: 401, error: 'Adventurer is still in dungeon.' }
  }

  let shouldStop = false
  if(venture.plan.type === 'count'){
    if(venture.plan.current >= venture.plan.limit){
      shouldStop = true
    }
  }else if(venture.plan.type === 'time'){
    // TODO this
  }

  if(shouldStop){
    stopVenture(venture)
  }else{
    venture.currentRun = await addRun(venture.adventurerID, venture.dungeonID)
    void await Adventurers.update(venture.adventurerID, { currentVenture: venture })
  }
}

export function stopVenture(venture){
  // TODO: this
}

export function runFinished(adventurerID){
  const venture = getByAdventurerID(adventurerID)
  venture.finishedRuns.push(venture.currentRun)
  venture.currentRun = null
  continueVenture(venture)
}