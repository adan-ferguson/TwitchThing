import db from '../db.js'
import DungeonRun from './dungeonRun.js'
import * as Adventurers from '../collections/adventurers.js'

const ventures = {}

export async function getByAdventurerID(adventurerID){
  const data = await Adventurers.loadData(adventurerID, {
    currentVenture: 1
  })
  return get(data.currentVenture)
}

export function get(ventureID){
  return ventures[ventureID]
}

// TODO: more options
export async function beginVenture(adventurerID, dungeonID){

  const venture = getByAdventurerID(adventurerID)
  if(venture){
    throw { code: 401, error: 'Can not enter dungeon, adventurer is already venturing.' }
  }

  // TODO: check if adventurer is allowed to run this dungeon

  const ventureID = db.id()
  ventures[ventureID] = {
    adventurerID,
    dungeonID,
    plan: {
      type: 'count',
      current: 0,
      limit: 1
    },
    currentRun: null,
    runs: []
  }

  Adventurers.update(adventurerID, { currentVenture: ventureID })
  continueVenture(ventureID)

  return ventureID
}

function continueVenture(ventureID){
  const venture = ventures[ventureID]
  if(!venture){
    throw { code: 401, error: 'Venture does not exist.' }
  }

  if(venture.currentRun && !venture.currentRun.finished){
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
    stopVenture(ventureID)
  }else{
    const dungeonRun = DungeonRun.create(venture.adventurerID, venture.dungeonID)
    // TODO: do things when things happen
    // dungeonRun.on('finished', () => continueVenture(ventureID))
    venture.runs.push(dungeonRun.id)
  }
}

export function stopVenture(ventureID){
  // TODO: this
}