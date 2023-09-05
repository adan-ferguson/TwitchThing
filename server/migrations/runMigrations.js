import DungeonRuns from '../collections/dungeonRuns.js'
import Collection from '../collections/collection.js'
import db from '../db.js'
import FullEvents from '../collections/fullEvents.js'
import { broadcast } from '../socketServer.js'
import { deepClone, roundToFixed, toPct } from '../../game/utilFunctions.js'
import Adventurers from '../collections/adventurers.js'
import { updateAccomplishments } from '../user/accomplishments.js'
import Users from '../collections/users.js'

const MIGRATION_ID = 81

const Migrations = new Collection('migrations', {
  migrationId: null
})

export async function runMigrations(){

  const m = await Migrations.findOne({ query: { migrationId: MIGRATION_ID } })
  if(m){
    return
  }

  console.log('running migration')

  await setUserAdvClassAccomplishments()

  console.log('done')
  Migrations.save({ migrationId: MIGRATION_ID })
}

async function setUserAdvClassAccomplishments(){
  for(let userDoc of await Users.find()){
    userDoc.accomplishments.advClasses = {}
    const advs = await Adventurers.find({
      query: {
        userID: userDoc._id
      }
    })
    for(let advDoc of advs){
      updateAccomplishments(userDoc, advDoc)
    }
    await Users.save(userDoc)
  }
}