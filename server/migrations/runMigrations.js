import DungeonRuns from '../collections/dungeonRuns.js'
import Collection from '../collections/collection.js'
import db from '../db.js'
import FullEvents from '../collections/fullEvents.js'
import { broadcast } from '../socketServer.js'

const MIGRATION_ID = 4

const Migrations = new Collection('migrations', {
  migrationId: null
})

export async function runMigrations(){

  const m = await Migrations.findOne({ query: { migrationId: MIGRATION_ID } })
  if(m){
    return
  }

  console.log('running migration')

  db.conn().collection('fullEvents').createIndex({ dungeonRunID: 1 })
  db.conn().collection('dungeonRuns').createIndex({ cancelled: 1 })

  console.log('indexes created')

  await compressEvents()
  setTimeout(() => {
    broadcast('force reload')
  }, 5000)
  console.log('done')
  Migrations.save({ migrationId: MIGRATION_ID })
}

/**
 * Version 0 -> 1
 * @returns {Promise<void>}
 */
async function compressEvents(){

  const runs = await DungeonRuns.find({})

  const eventsToAdd = []
  const runsToSave = []

  console.log('Converting runs...')
  runs.forEach((r,i) => {
    if(i % 100 === 0){
      console.log(i + ' / ' + runs.length)
    }
    if(!r.events?.length){
      return
    }
    r.events?.forEach(event => {
      const withoutId = { ...event }
      delete withoutId._id
      eventsToAdd.push({
        dungeonRunID: r._id,
        data: event,
      })
    })
    r.events = null
    runsToSave.push(r)
  })

  console.log(runs.length + ' / ' + runs.length)
  console.log('trial migration finished')
  console.log(`${runsToSave.length} runs to updates, ${eventsToAdd.length} fullEvents to add`)

  process.exit()
  // await FullEvents.saveMany(eventsToAdd)
  // await DungeonRuns.saveMany(runsToSave)
}