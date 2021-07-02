const db = require('../db.js')
const Bonuses = require('./bonuses')

const DEFAULTS = {
  username: '',
  twitchInfo: {},
  exp: 0,
  money: 100
}

class User {

  static createNew(twitchInfo){
    const user = new User({
      username: twitchInfo.login,
      twitchInfo: twitchInfo
    })
    user.save()
    return user
  }

  constructor(userRecord){
    this.userRecord = fixBackwardsCompatibility(userRecord)
  }

  get username(){
    return this.userRecord.username
  }

  async save(){
    await db.conn().collection('users').save(this.userRecord)
  }

  async gameData(){
    return {
      username: this.userRecord.username,
      exp: this.userRecord.exp,
      money: this.userRecord.money
    }
  }

  async checkForChatBonus(channel){
    let moneyChange = 0
    moneyChange += await Bonuses.checkForChannelChatBonus(this, channel)
    moneyChange += await Bonuses.checkForChatBonus(this)
    if(moneyChange){
      this.userRecord.money += moneyChange
      // TODO: socket event
      this.save()
    }
  }
}

function fixBackwardsCompatibility(user){
  return Object.assign({}, DEFAULTS, user)
}

async function load(username){
  const userRecord = await db.conn().collection('users').findOne({
    username: username
  })
  return userRecord ? new User(userRecord) : null
}

async function create(twitchInfo){
  return User.createNew(twitchInfo)
}

module.exports = { load, create }
