const { Client } = require('tmi.js')
const Channels = require('./collections/channels')
const User = require('./collections/users')
const log = require('fancy-log')

async function init(){

  const client = new Client({
    connection: {
      secure: true,
      reconnect: true
    },
    channels: (await Channels.loadAll()).map(channel => channel.name)
  })

  Channels.on('channel_add', channel => {
    client.join(channel.name)
  })

  Channels.on('channel_remove', channel => {
    client.leave(channel.name)
  })

  await client.connect()

  client.on('message', (channelName, tags) => {

    const user = User.load(tags['username'])
    if(!user) {
      return
    }

    const channel = Channels.load(channelName.name.substring(1))
    if(!channel || !channel.isStreaming) {
      return
    }

    user.checkForChatBonus(channel)
  })

  log('Chatbot initialized')
}

module.exports = { init }