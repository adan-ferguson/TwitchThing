import fs from 'fs'
import { Console } from 'console'
import log from 'fancy-log'

export function initLogging(){

  const RESTART_MARKER = '------------------------------------------------'
  const logger = new Console({
    stderr: fs.createWriteStream('logs/error.log', { flags: 'a' }),
    stdout: fs.createWriteStream('logs/output.log', { flags: 'a' })
  })

  logger.log(RESTART_MARKER)
  logger.error(RESTART_MARKER)

  global.console.log = function(){
    log(...arguments)
    logger.log(...arguments)
  }

  global.console.error = function(){
    log.error(...arguments)
    logger.error(...arguments)
  }

}