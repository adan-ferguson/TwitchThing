import DungeonRuns from '../collections/dungeonRuns.js'
import Collection from '../collections/collection.js'
import db from '../db.js'
import FullEvents from '../collections/fullEvents.js'
import { broadcast } from '../socketServer.js'

const MIGRATION_ID = 6

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

  console.log('loading runs')

  const query = { 'events.1': { $exists: true } }
  const length = await DungeonRuns.collection.countDocuments(query)
  const cursor = DungeonRuns.collection.find(query)

  const eventsToAdd = []
  const runsToSave = []

  console.log(`Converting ${length} runs...`)

  let i = 0
  for await (const doc of cursor){
    if(i % 10 === 0){
      console.log(i + ' / ' + length)
    }
    i++
    if(!doc.events?.length){
      return
    }
    doc.events?.forEach(event => {
      const withoutId = { ...event }
      delete withoutId._id
      eventsToAdd.push({
        dungeonRunID: doc._id,
        data: event,
      })
    })
    doc.events = null
    runsToSave.push(doc)
  }

  console.log(length + ' / ' + length)
  console.log('trial migration finished')
  console.log(`${runsToSave.length} runs to update, ${eventsToAdd.length} fullEvents to add`)

  process.exit()
  // await FullEvents.saveMany(eventsToAdd)
  // await DungeonRuns.saveMany(runsToSave)
}