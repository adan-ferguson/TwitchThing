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

export function generateCombat(fighterDef1, fighterDef2, params = {}){
  return new Promise((res, rej) => {
    const id = uniqueID()
    const timestamp = Date.now()
    callbacks[id] = async({ combatDoc, error }) => {
      if(error){
        rej(error)
        return
      }
      combatDoc.responseTime = Date.now() - timestamp
      console.log('combat', combatDoc.calculationTime, combatDoc.responseTime)
      res(await Combats.save(combatDoc))
    }
    worker.postMessage({
      workerId: id,
      params,
      fighterDef1,
      fighterDef2
    })
  })
}