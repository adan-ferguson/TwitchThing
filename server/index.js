import Chatbot from './twitch/chatbot.js'
import Channels from './collections/channels.js'
import Server from './server.js'
import db from './db.js'
import log from 'fancy-log'

db.init().then(async () => {
  await Channels.init()
  await Chatbot.init()
  await Server.init().catch(error => {
    log('Server failed to load.', error)
  })
})