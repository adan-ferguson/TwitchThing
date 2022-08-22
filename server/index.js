import Server from './server.js'
import db from './db.js'
import * as DungeonRunner from './dungeons/dungeonRunner.js'
import { initLogging } from './logging.js'

initLogging().then(() => {
  db.init().then(async () => {
    DungeonRunner.start()
    await Server.init().catch(error => {
      console.log('Server failed to load.', error)
    })
  })
})
