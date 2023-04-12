import { parentPort } from 'node:worker_threads'
import { runCombat } from './combat.js'

// eslint-disable-next-line no-useless-catch
try {
  init()
}catch(ex){
  throw ex
}

function init(){
  parentPort.on('message', data => {
    try {
      parentPort.postMessage({
        workerId: data.workerId,
        combatDoc: runCombat(data)
      })
    }catch(error){
      parentPort.postMessage({
        workerId: data.workerId,
        error
      })
    }
  })
}

