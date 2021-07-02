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
    channels: (await Channels.getList()).map(channel => channel.name)
  })

  Channels.on('channel_add', name => {
    client.join(name)
  })

  Channels.on('channel_remove', name => {
    client.leave(name)
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