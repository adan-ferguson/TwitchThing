const eventEmitter = new require('events').EventEmitter()
const db = require('../db.js')

let __channels

/**
 * @returns {Promise<Array[Channel]>}
 */
async function getList(){
  if(!__channels){
    __channels = await db.conn().collection('channels').find()
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
  eventEmitter.emit('channel_add', name)
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
  eventEmitter.emit('channel_remove', name)
}

module.exports = {
  on: eventEmitter.on,
  getList,
  add,
  remove
}