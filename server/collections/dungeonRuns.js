import db from '../db.js'

const DEFAULTS = {
  _id: null,
  adventurerID: null,
  dungeonID: null,
  // floor: 1,
  // loot: [],
  // events: [],
  // adventurerState: {}
}

export async function create(adventurerID, dungeonID){
  return await db.save({
    ...DEFAULTS,
    adventurerID,
    dungeonID
  }, 'dungeonRuns')
}

export async function loadAllInProgress(){

}