import Server from './server.js'
import db from './db.js'
import * as DungeonRunner from './dungeons/dungeonRunner.js'
import { initLogging } from './logging.js'
import { validateAllSkills } from './adventurer/skills.js'
import { validateAllItems } from './adventurer/items.js'

initLogging().then(() => {
  db.init().then(async () => {
    validateEverything()
    DungeonRunner.start()
    await Server.init().catch(error => {
      console.log('Server failed to load.', error)
    })
  })
})

function validateEverything(){
  validateAllItems()
  validateAllSkills()
}

