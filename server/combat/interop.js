import { fileURLToPath } from 'url'
import path from 'path'
import { Worker } from 'node:worker_threads'
import { uniqueID } from '../../game/utilFunctions.js'
import Combats from '../collections/combats.js'

let worker
let callbacks = {}

export async function startCombatWorker(){
  const workerPath = path.resolve(fileURLToPath(import.meta.url), '..', 'worker.js')
  worker = new Worker(workerPath)
  worker.on('message', obj => {
    if(callbacks[obj.workerId]){
      callbacks[obj.workerId](obj)
      delete callbacks[obj.workerId]
    }
  })
  worker.on('error', msg => {
    console.error('Worker error: ', msg)
  })
  worker.on('exit', () => {
    console.error('Worker stopped for some reason')
    process.exit()
  })
  console.log('Worker connected')
}

export function generateCombat(data, combatID = null){
  return new Promise((res, rej) => {
    const id = uniqueID()
    const timestamp = Date.now()
    callbacks[id] = async({ combatDoc, error }) => {
      if(error){
        rej(error)
        return
      }
      combatDoc.times.init = timestamp
      combatDoc.times.startup = combatDoc.times.start - combatDoc.times.init
      combatDoc.times.calc = combatDoc.times.finish - combatDoc.times.start
      combatDoc.times.total = combatDoc.times.finish - combatDoc.times.init
      if(combatID){
        combatDoc._id = combatID
      }
      const doc = await Combats.save(combatDoc)
      res(doc)
    }
    worker.postMessage({
      workerId: id,
      data
    })
  })
}