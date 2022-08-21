import fs from 'fs'
import { Console } from 'console'

export function initLogging(){

  const logger = new Console({
    stderr: fs.createWriteStream('output.log'),
    stdout: fs.createWriteStream('error.log')
  })

  const clog = global.console.log
  global.console.log = function(){
    clog(...arguments)
    logger.log(...arguments)
  }

  const cerror = global.console.error
  global.console.error = function(){
    cerror(...arguments)
    logger.error(...arguments)
  }

}