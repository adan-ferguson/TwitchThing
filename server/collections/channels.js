const { EventEmitter } = new require('events')
const emitter = new EventEmitter()
const log = require('fancy-log')

const db = require('../db')
const TwitchApi = require('../twitch/api')

/**
 * How often we update the isStreaming property for channels
 * @type {number} Time in seconds
 */
const UPTIME_CHECK_FREQUENCY = 60

const DEFAULTS = {
  name: '',
  accessToken: null,
  enabled: true,
  isStreaming: false
}

class Channel {

  static async createNew(name){
    const channel = new Channel({
      name: name.toLowerCase()
    })
    await db.conn().collection('channels').insertOne(channel.doc)
    emitter.emit('channel_add', channel)
    return channel
  }

  constructor(channelDocument){
    this.doc = fixBackwardsCompatibility(channelDocument)
  }

  get name(){
    return this.doc.name
  }

  async accessTokenValid(){
    if(!this.doc.accessToken){
      return false
    }
    return await TwitchApi.validateAccessToken(this.doc.accessToken, this.name, true)
  }

  async update(changes){
    Object.assign(this.doc, changes)
    await this.save()
  }

  async save(){
    await db.conn().collection('channels').replaceOne({ name: this.name }, this.doc)
    return this
  }

  async delete(){
    await db.conn().collection('channels').remove({ name: this.doc.name })
    emitter.emit('channel_remove', this)
  }
}

function fixBackwardsCompatibility(channelDocument){
  const doc = Object.assign({}, DEFAULTS, channelDocument)
  if(doc.authToken){
    doc.accessToken = doc.authToken
    delete doc.authToken
  }
  return doc
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

  setupUptimeUpdates()
  log('Channels initialized')

  function setupUptimeUpdates(){
    // Set up the uptime updates
    setInterval(update, UPTIME_CHECK_FREQUENCY * 1000)
    update()
  }

  async function update(){
    const channels = await loadAll()
    const onlineStreams = await TwitchApi.getOnlineStreams(channels.map(channel => channel.name))
    channels.forEach(channel => {
      const isStreaming = onlineStreams.find(name => name === channel.name) ? true : false
      if(isStreaming !== channel.doc.isStreaming){
        channel.doc.isStreaming = isStreaming
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