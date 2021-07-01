const { Client } = require('tmi.js')
const Channel = require('./db_models/channel')
const User = require('./db_models/user')

async function setup(){

  const client = new Client({
    connection: {
      secure: true,
      reconnect: true
    },
    channels: (await Channel.getList()).map(channel => channel.name)
  })

  Channel.on('channel_add', name => {
    client.join(name)
  })

  Channel.on('channel_remove', name => {
    client.leave(name)
  })

  client.connect()

  client.on('message', (channel, tags) => {
    const user = User.load(tags['username'])
    if(user){
      user.chatBonusCheck(channel.name)
    }
  })
}

module.exports = { setup }