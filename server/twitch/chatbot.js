import { Client } from 'tmi.js'
import Channels from '../collections/channels.js'
import User from '../collections/users.js'
import log from 'fancy-log'

async function init(){

  const channels = (await Channels.loadAll()).map(channel => channel.name)
  const client = new Client({
    connection: {
      secure: true,
      reconnect: true
    },
    channels: channels
  })

  Channels.on('channel_add', channel => {
    client.join(channel.name)
  })

  Channels.on('channel_remove', channel => {
    client.leave(channel.name)
  })

  await client.connect().catch(e => {
    log(e)
  })

  client.on('message', async (channelName, tags) => {

    const user = await User.load(tags['username'])
    if(!user) {
      return
    }

    const channel = await Channels.load(channelName.substring(1))
    if(!channel || /*!channel.doc.isStreaming ||*/ !channel.doc.enabled) {
      return
    }

    console.log('chatted', user.username)

    user.checkForChatBonus(channel)
  })

  log('Chatbot initialized')
}

export default { init }