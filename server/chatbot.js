const { Client } = require('tmi.js')
const Channels = require('./db_models/channels')

async function setup(){

  const client = new Client({
    connection: {
      secure: true,
      reconnect: true
    },
    channels: (await Channels.getList()).map(channel => channel.name)
  })

  Channels.on('channel_add', name => {
    client.join(name)
  })

  Channels.on('channel_remove', name => {
    client.leave(name)
  })

  client.connect()

  client.on('message', (channel, tags, message, self) => {
    console.log(channel, tags, message, self)
  })
}

module.exports = { setup }