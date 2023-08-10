import DungeonRuns from '../collections/dungeonRuns.js'
import Collection from '../collections/collection.js'
import db from '../db.js'
import Events from '../collections/fullEvents.js'

const MIGRATION_ID = 1

const Migrations = new Collection('migrations', {
  migrationId: null
})

export async function runMigrations(){
  const m = await Migrations.findOne({ query: { migrationId: MIGRATION_ID } })
  if(m){
    return
  }

  console.log('running migrations')

  db.conn().collection('fullEvents').createIndex({ dungeonRunID: 1 })
  db.conn().collection('dungeonRuns').createIndex({ cancelled: 1 })

  await compressEvents()
  Migrations.save({ migrationId: MIGRATION_ID })
}

/**
 * Version 0 -> 1
 * @returns {Promise<void>}
 */
async function compressEvents(){

  const runs = await DungeonRuns.find({
    version: {
      $le: 0
    }
  })

  const eventsToAdd = []
  runs.forEach(r => {
    r.events?.forEach(event => {
      const withoutId = { ...event }
      delete withoutId._id
      eventsToAdd.push({
        dungeonRunID: r._id,
        data: event,
      })
    })

    r.events = null
  })

  await Events.saveMany(eventsToAdd)
  await DungeonRuns.saveMany(runs)
}