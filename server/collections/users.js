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
    await db.conn().collection('users').insertOne(user.doc)
    return user
  }

  constructor(userDocument){
    this.doc = fixBackwardsCompatibility(userDocument)
  }

  get username(){
    return this.doc.username
  }

  async save(){
    await db.conn().collection('users').replaceOne({ username: this.username }, this.doc)
  }

  async gameData(){
    return {
      username: this.doc.username,
      exp: this.doc.exp,
      money: this.doc.money
    }
  }

  async checkForChatBonus(channel){

    const moneyBefore = this.doc.money
    await Bonuses.giveChannelChatBonus(this, channel)
    await Bonuses.giveChatBonus(this, channel)

    const moneyChange = this.doc.money - moneyBefore
    if(moneyChange){
      // TODO: socket event
      await this.save()
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
