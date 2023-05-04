import { parentPort } from 'node:worker_threads'
import { runCombat } from './combat.js'

// eslint-disable-next-line no-useless-catch
try {
  init()
}catch(ex){
  throw ex
}

function init(){
  parentPort.on('message', async data => {
    try {
      parentPort.postMessage({
        workerId: data.workerId,
        combatDoc: await runCombat(data.data)
      })
    }catch(error){
      parentPort.postMessage({
        workerId: data.workerId,
        error
      })
    }
  })
}

