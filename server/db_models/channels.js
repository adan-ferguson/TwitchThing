const { EventEmitter } = new require('events')
const emitter = new EventEmitter()
const db = require('../db.js')

let __channels

/**
 * @returns {Promise<Array[Channel]>}
 */
async function getList(){
  if(!__channels){
    __channels = await db.conn().collection('channels').find().toArray()
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
  return await db.conn().collection('channels').findOne({
    name: name
  })
}

module.exports = {
  on: emitter.on,
  getList,
  add,
  remove,
  get
}