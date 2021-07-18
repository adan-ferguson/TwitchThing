import db from '../db.js'
import { emit } from '../socketServer.js'
import Bonuses from './bonuses.js'
import { loadByUser } from './characters.js'
import debounce from 'debounce'
import log from 'fancy-log'

const DEFAULTS = {
  username: '',
  displayname: '',
  resources: {
    money: 100
  }
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
    this.save = debounce(this.save)
  }

  get username(){
    return this.doc.username
  }

  save(){
    db.conn().collection('users').replaceOne({ username: this.username }, this.doc)
    this._resourcesUpdated()
    this.oldDoc = Object.assign({}, this.doc)
  }

  async gameData(){
    return {
      username: this.username,
      displayname: this.doc.displayname,
      resources: this.doc.resources,
      characters: await loadByUser(this.username)
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

  _resourcesUpdated(){
    const resourcesDiff = calcDiff(this.doc.resources, this.oldDoc.resources)
    if(!Object.keys(resourcesDiff).length){
      return
    }
    this.emit('resources_updated', {
      diff: resourcesDiff,
      oldVals: this.oldDoc.resources,
      newVals: this.doc.resources
    })
  }
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

function fixBackwardsCompatibility(doc){
  if(doc.twitchInfo){
    doc.displayname = doc.twitchInfo.display_name
    delete doc.twitchInfo
  }
  if(doc.money){
    doc.resources = {
      money: doc.money
    }
    delete doc.money
  }
  delete doc.exp
  return Object.assign({}, DEFAULTS, doc)
}

export default { load, create }
