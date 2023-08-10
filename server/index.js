import Server from './server.js'
import db from './db.js'
import * as DungeonRunner from './dungeons/dungeonRunner.js'
import { initLogging } from './logging.js'
import { startCombatWorkers } from './combat/interop.js'
import { validateAllMonsters } from './validations/monster.js'
import { validateAllItems } from './validations/adventurerItem.js'
import { validateAllSkills } from './validations/adventurerSkill.js'
import { validateAllBaseEffects } from './validations/effect.js'
import { runMigrations } from './migrations/runMigrations.js'

init().catch(ex => {
  console.error(ex)
  process.exit()
})

async function init(){
  await initLogging()
  await db.init()
  validateEverything()
  await startCombatWorkers()
  // await Server.init().catch(error => {
  //   console.log('Server failed to load.', error)
  // })
  await runMigrations()
  DungeonRunner.start()
}

function validateEverything(){
  validateAllItems()
  validateAllSkills()
  validateAllMonsters()
  validateAllBaseEffects()
}

