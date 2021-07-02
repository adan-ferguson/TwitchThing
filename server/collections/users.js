const db = require('../db.js')
const Bonuses = require('./bonuses')

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
    await db.conn().collection('users').insertOne(user.userDocument)
    return user
  }

  constructor(userDocument){
    this.userDocument = fixBackwardsCompatibility(userDocument)
  }

  get username(){
    return this.userDocument.username
  }

  async save(){
    await db.conn().collection('users').replaceOne({ username: this.username }, this.userDocument)
  }

  async gameData(){
    return {
      username: this.userDocument.username,
      exp: this.userDocument.exp,
      money: this.userDocument.money
    }
  }

  async checkForChatBonus(channel){
    let moneyChange = 0
    moneyChange += await Bonuses.checkForChannelChatBonus(this, channel)
    moneyChange += await Bonuses.checkForChatBonus(this)
    if(moneyChange){
      this.userDocument.money += moneyChange
      // TODO: socket event
      this.save()
    }
  }
}

function fixBackwardsCompatibility(user){
  return Object.assign({}, DEFAULTS, user)
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
