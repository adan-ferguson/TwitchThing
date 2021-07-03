const Chatbot = require('./chatbot')
const Channels = require('./collections/channels')
const Server = require('./server')
const db = require('./db')

db.init().then(async () => {
  await Channels.init()
  await Chatbot.init()
  await Server.init()
})