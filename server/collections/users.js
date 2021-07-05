const db = require('../db.js')
const emit = require('../socketServer').emit
const Bonuses = require('./bonuses')
const debounce = require('debounce')
const log = require('fancy-log')

const DEFAULTS = {
  username: '',
  twitchInfo: {},
  exp: 0,
  money: 100
}

class User {

  static async createNew(twitchInfo){
    const user = new User({
      username: twitchInfo.login.toLowerCase(),
      twitchInfo: twitchInfo
    })
    await db.conn().collection('users').insertOne(user.doc)
    return user
  }

  constructor(userDocument){
    this.oldDoc = fixBackwardsCompatibility(userDocument)
    this.doc = Object.assign({}, userDocument)
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
      mewDoc: this.doc
    })
  }

  async gameData(){
    return {
      username: this.doc.username,
      exp: this.doc.exp,
      money: this.doc.money
    }
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

function fixBackwardsCompatibility(user){
  return Object.assign({}, DEFAULTS, user)
}

function calcDiff(newObj, oldObj){
  const diff = {}
  Object.keys(newObj).forEach(key => {
    const oldVal = oldObj[key]
    const newVal = newObj[key]
    if(oldVal !== newVal){
      diff[key] = { oldVal, newVal }
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
