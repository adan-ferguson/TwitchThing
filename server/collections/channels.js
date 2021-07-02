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
      name: name.toLowerCase()
    })
    await db.conn().collection('channels').insertOne(channel.channelDocument)
    emitter.emit('channel_add', channel)
    return channel
  }

  constructor(channelDocument){
    this.channelDocument = fixBackwardsCompatibility(channelDocument)
  }

  get name(){
    return this.channelDocument.name
  }

  async save(){
    await db.conn().collection('channels').replaceOne({ name: this.name }, this.channelDocument)
    return this
  }

  async delete(){
    await db.conn().collection('channels').remove({ name: this.channelDocument.name })
    emitter.emit('channel_remove', this)
  }
}

function fixBackwardsCompatibility(channelDocument){
  return Object.assign({}, DEFAULTS, channelDocument)
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
  const channelDocument = await db.conn().collection('channels').findOne({
    name: name.toLowerCase()
  })
  return channelDocument ? new Channel(channelDocument) : null
}

/**
 * @returns {Promise<[Channel]>}
 */
async function loadAll(){
  const channelDocuments = await db.conn().collection('channels').find().toArray()
  return channelDocuments.map(document => new Channel(document))
}

async function init(){

  await createFromConfig()
  setupUptimeUpdates()
  log('Channels initialized')

  async function createFromConfig(){
    for(let name of initialChannels){
      if(!await load(name)){
        await Channel.createNew(name)
      }
    }
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
      const isStreaming = onlineStreams.find(name => name === channel.name) ? true : false
      if(isStreaming !== channel.channelDocument.isStreaming){
        channel.channelDocument.isStreaming = isStreaming
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