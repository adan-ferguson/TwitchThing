import Server from './server.js'
import db from './db.js'
import * as DungeonRunner from './dungeons/dungeonRunner.js'
import { initLogging } from './logging.js'
import { startCombatWorker } from './combat/interop.js'
import { validateAllMonsters } from './validations/monster.js'
import { validateAllItems } from './validations/adventurerItem.js'
import { validateAllSkills } from './validations/adventurerSkill.js'
import { validateAllStatusEffects } from './validations/effect.js'

init().catch(ex => {
  console.error(ex)
  process.exit()
})

async function init(){
  await initLogging()
  await db.init()
  await startCombatWorker()
  validateEverything()
  DungeonRunner.start()
  await Server.init().catch(error => {
    console.log('Server failed to load.', error)
  })
}

function validateEverything(){
  validateAllItems()
  validateAllSkills()
  validateAllMonsters()
  validateAllStatusEffects()
}

