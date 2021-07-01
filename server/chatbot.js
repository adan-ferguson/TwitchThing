const { Client } = require('tmi')
const Channels = require('./db_models/channels')

async function setup(){

  const client = new Client({
    connection: {
      secure: true,
      reconnect: true
    },
    channels: await Channels.getList()
  })

  Channels.on('channel_add', name => {
    client.join(name)
  })

  Channels.on('channel_remove', name => {
    client.leave(name)
  })

  client.connect()

  client.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message}`)
  })
}

module.exports = { setup }