import { fileURLToPath } from 'url'
import path from 'path'
import { Worker } from 'node:worker_threads'
import { uniqueID } from '../../game/utilFunctions.js'
import Combats from '../collections/combats.js'

const WORKER_COUNT = 4
const workers = []
const queue = []
let callbacks = {}

export async function startCombatWorkers(){
  const workerPath = path.resolve(fileURLToPath(import.meta.url), '..', 'worker.js')
  for(let i = 0; i < WORKER_COUNT; i++){
    const worker = new Worker(workerPath)
    const workerDef = { worker, isBusy: false }
    worker.on('message', obj => {
      if(callbacks[obj.workerId]){
        callbacks[obj.workerId](obj)
        delete callbacks[obj.workerId]
      }
      console.log('unbusy')
      if(queue.length){
        queue.splice(0, 1)[0](worker)
      }else{
        workerDef.isBusy = false
      }
    })
    worker.on('error', msg => {
      console.error('Worker error: ', msg)
    })
    worker.on('exit', () => {
      console.error('Worker stopped for some reason! Fatal error or something.')
      process.exit()
    })
    workers.push(workerDef)
  }
  console.log('Workers connected')
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
      console.log('combat ran', combatID, combatDoc.times.startup, combatDoc.times.calc)
      res(doc)
    }
    getAvailableWorker().then(worker => {
      console.log('Workers + Queue Length', ...workers.map(w => w.isBusy ? 1 : 0), queue.length)
      worker.postMessage({
        workerId: id,
        data
      })
    })
  })
}

function getAvailableWorker(){
  return new Promise(res => {
    const nonBusy = workers.findIndex(w => !w.isBusy)
    if(nonBusy > -1){
      workers[nonBusy].isBusy = true
      return res(workers[nonBusy].worker)
    }
    queue.push(res)
  })
}