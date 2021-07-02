const { EventEmitter } = new require('events')
const emitter = new EventEmitter()
const log = require('fancy-log')

const db = require('../db')
const Twitch = require('../twitch')

const initialChannels = require('../../config.json').initialChannels

/**
 * How often we update the isStreaming property for channels
 * @type {number} Time in seconds
 */
const UPTIME_CHECK_FREQUENCY = 60

const DEFAULTS = {
  name: '',
  isStreaming: false
}

class Channel {

  static async createNew(name){
    const channel = new Channel({
      name: name
    })
    await channel.save()
    emitter.emit('channel_add', channel)
    return channel
  }

  constructor(channelRecord){
    this.channelRecord = fixBackwardsCompatibility(channelRecord)
  }

  get name(){
    return this.channelRecord.name
  }

  async save(){
    await db.conn().collection('channels').save(this.channelRecord)
    return this
  }

  async delete(){
    await db.conn().collection('channels').remove({ name: this.channelRecord.name })
    emitter.emit('channel_remove', this)
  }
}

function fixBackwardsCompatibility(channelRecord){
  return Object.assign({}, DEFAULTS, channelRecord)
}

/**
 * Add a channel to the list
 * @param name {string}
 * @returns {Channel}
 */
async function add(name){
  return await Channel.createNew(name)
}

/**
 * @param name {string} The channel's name
 * @returns {Promise<Channel|null>}
 */
async function load(name){
  const channelRecord = await db.conn().collection('channels').findOne({
    name: name
  })
  return channelRecord ? new Channel(channelRecord) : null
}

/**
 * @returns {Promise<[Channel]>}
 */
async function loadAll(){
  const channelRecords = await db.conn().collection('channels').find().toArray()
  return channelRecords.map(record => new Channel(record))
}

async function init(){

  await createFromConfig()
  setupUptimeUpdates()
  log('Channels initialized')

  async function createFromConfig(){
    await initialChannels.forEach(async name => {
      if(!await load(name)){
        await Channel.createNew(name)
      }
    })
  }

  function setupUptimeUpdates(){
    // Set up the uptime updates
    setInterval(update, UPTIME_CHECK_FREQUENCY * 1000)
    update()
  }

  async function update(){
    const channels = await loadAll()
    const onlineStreams = await Twitch.getOnlineStreams(channels.map(channel => channel.name))
    channels.forEach(channel => {
      const isStreaming = onlineStreams.find(name === channel.name) ? true : false
      if(isStreaming !== channel.channelRecord.isStreaming){
        channel.channelRecord.isStreaming = isStreaming
        channel.save()
      }
    })
  }
}

module.exports = {
  on: emitter.on,
  add,
  load,
  loadAll,
  init
}