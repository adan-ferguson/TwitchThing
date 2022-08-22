import fs from 'fs'
import { Console } from 'console'
import log from 'fancy-log'
import readLastLines from 'read-last-lines'

const dateStr = new Date().toJSON().slice(0,10)
const START = '-----------------------------------------------------'
const ERROR_LOG_PATH = `logs/error/${dateStr}.log`
const OUTPUT_LOG_PATH = `logs/output/${dateStr}.log`
let logger
export async function initLogging(){

  const { errStream, outputStream } = await streams()

  logger = new Console({
    stderr: errStream,
    stdout: outputStream
  })

  logger.log(START)
  logger.error(START)

  global.console.log = function(){
    log(...arguments)
    logger.log(...arguments)
  }

  global.console.error = function(){
    log.error(...arguments)
    logger.error(...arguments)
  }

}

export async function getOutputLogTail(lines = 100){
  if(!logger){
    return
  }
  return await readLastLines.read(OUTPUT_LOG_PATH, lines)
}

export async function getErrorLogTail(lines = 100){
  if(!logger){
    return
  }
  return await readLastLines.read(ERROR_LOG_PATH, lines)
}

function streams(){
  return new Promise((res, rej) => {
    fs.mkdir('logs/error', { recursive: true }, () => {
      fs.mkdir('logs/output', { recursive: true }, () => {
        const errStream = fs.createWriteStream(ERROR_LOG_PATH, { flags: 'a' }).on('open', () => {
          const outputStream = fs.createWriteStream(OUTPUT_LOG_PATH, { flags: 'a' }).on('open', () => {
            res({ errStream, outputStream })
          })
        })
      })
    })
  })
}