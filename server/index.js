import Server from './server.js'
import db from './db.js'
import log from 'fancy-log'
import * as DungeonRunner from './dungeons/dungeonRunner.js'

const clog = global.console.log
global.console.log = function(){
  clog(...arguments)
}

const cerror = global.console.error
global.console.error = function(){
  cerror(...arguments)
}

db.init().then(async () => {
  DungeonRunner.start()
  await Server.init().catch(error => {
    log('Server failed to load.', error)
  })
})