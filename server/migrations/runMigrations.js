import DungeonRuns from '../collections/dungeonRuns.js'
import Collection from '../collections/collection.js'
import db from '../db.js'
import FullEvents from '../collections/fullEvents.js'
import { broadcast } from '../socketServer.js'
import { roundToFixed, toPct } from '../../game/utilFunctions.js'

const MIGRATION_ID = 7

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

  const runsToSave = []

  console.log(`Converting ${length} runs...`)

  let i = 0
  let eventsAdded = 0
  for await (const doc of cursor){
    if(i % 10 === 0){
      const used = process.memoryUsage().heapUsed / 1024 / 1024
      const total = process.memoryUsage().heapTotal / 1024 / 1024
      console.log(i + ' / ' + length,
        roundToFixed(used),
        roundToFixed(total),
        toPct(used / total),
      )
    }
    i++
    if(!doc.events?.length){
      return
    }
    const fullEvents = doc.events?.map(event => {
      const withoutId = { ...event }
      delete withoutId._id
      eventsAdded++
      return {
        dungeonRunID: doc._id,
        data: event,
      }
    })
    await FullEvents.saveMany(fullEvents)
    doc.events = null
    runsToSave.push(doc)
  }

  console.log(length + ' / ' + length)
  console.log(`${runsToSave.length} runs to update, ${eventsAdded} fullEvents added`)
  await DungeonRuns.saveMany(runsToSave)
}