import Server from './server.js'
import db from './db.js'
import * as DungeonRunner from './dungeons/dungeonRunner.js'
import { initLogging } from './logging.js'
import { validateAllItems, validateAllSkills } from './adventurer/loadoutObjects.js'

init()

async function init(){
  await initLogging()
  await db.init()
  validateEverything()
  DungeonRunner.start()
  await Server.init().catch(error => {
    console.log('Server failed to load.', error)
  })
}

function validateEverything(){
  validateAllItems()
  validateAllSkills()
}

