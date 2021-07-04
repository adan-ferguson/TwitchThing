const Chatbot = require('./chatbot')
const Channels = require('./collections/channels')
const Server = require('./server')
const db = require('./db')
const log = require('fancy-log')

db.init().then(async () => {
  await Channels.init()
  await Chatbot.init()
  await Server.init().catch(error => {
    log('Server failed to load.', error)
  })
})