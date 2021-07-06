const db = require('../db.js')
const emit = require('../socketServer').emit
const Bonuses = require('./bonuses')
const debounce = require('debounce')
const log = require('fancy-log')

const DEFAULTS = {
  username: '',
  displayname: '',
  exp: 0,
  money: 100
}

class User {

  static async createNew(twitchInfo){
    const user = new User({
      username: twitchInfo.login.toLowerCase(),
      displayname: twitchInfo.display_name.toLowerCase()
    })
    await db.conn().collection('users').insertOne(user.doc)
    return user
  }

  constructor(userDocument){
    this.oldDoc = fixBackwardsCompatibility(userDocument)
    this.doc = Object.assign({}, this.oldDoc)
    this._save = debounce(this._save, 200)
  }

  get username(){
    return this.doc.username
  }

  update(changes){
    Object.assign(this.doc, changes)
    this._save()
  }

  _save(){
    const diff = calcDiff(this.doc, this.oldDoc)
    if(!Object.keys(diff).length){
      return
    }

    db.conn().collection('users').replaceOne({ username: this.username }, this.doc)
    this.oldDoc = Object.assign({}, this.doc)
    this.emit('updated', {
      diff: diff,
      newDoc: this.doc
    })
  }

  async gameData(){
    return this.doc
  }

  async checkForChatBonus(channel){
    await Bonuses.giveChannelChatBonus(this, channel)
    await Bonuses.giveChatBonus(this, channel)
  }

  emit(eventName, data){
    log(this.username, eventName, data)
    emit(this.username, eventName, data)
  }
}

function fixBackwardsCompatibility(doc){
  if(doc.twitchInfo){
    doc.displayname = doc.twitchInfo.display_name
    delete doc.twitchInfo
  }
  return Object.assign({}, DEFAULTS, doc)
}

function calcDiff(newObj, oldObj){
  const diff = {}
  Object.keys(newObj).forEach(key => {
    const oldVal = oldObj[key]
    const newVal = newObj[key]
    const change = newVal - oldVal
    if(change){
      diff[key] = { oldVal, newVal, change }
    }
  })
  return diff
}

async function load(username){
  const userDocument = await db.conn().collection('users').findOne({
    username: username.toLowerCase()
  })
  return userDocument ? new User(userDocument) : null
}

async function create(twitchInfo){
  return User.createNew(twitchInfo)
}

module.exports = { load, create }
