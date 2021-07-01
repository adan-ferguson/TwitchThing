const { EventEmitter } = new require('events')
const emitter = new EventEmitter()
const db = require('../db.js')
const initialChannels = require('../../config.json').initialChannels

let __channels

/**
 * @returns {Promise<Array[Channel]>}
 */
async function getList(){
  if(!__channels){
    __channels = await db.conn().collection('channels').find().toArray()
    await generateChannelsFromConfig()
  }
  return __channels
}

/**
 * Add a channel to the list
 * @param name {string}
 * @returns {Promise<void>}
 */
async function add(name){
  const channels = await getList()
  const channel = {
    name: name
  }
  await db.conn().collection('channels').save(channel)
  channels.push(name)
  emitter.emit('channel_add', name)
}

/**
 * Remove a channel from the list
 * @param name
 * @returns {Promise<void>}
 */
async function remove(name){
  const channels = await getList()
  const index = channels.findIndex(channel => {
    channel.name === name
  })
  if(index === -1){
    return
  }
  db.conn().collection('channels').remove({ name: name })
  channels.splice(index, 1)
  emitter.emit('channel_remove', name)
}

/**
 * @param name {string} The channel's name
 * @returns {Promise<void>}
 */
async function get(name){
  const channels = await getList()
  return channels.find(channel => channel.name === name)
}

async function generateChannelsFromConfig(){
  initialChannels.forEach(async name => {
    const c = await get(name)
    if(!c){
      await add(name)
    }
  })
}

module.exports = {
  on: emitter.on,
  getList,
  add,
  remove,
  get
}