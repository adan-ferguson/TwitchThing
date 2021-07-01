const db = require('../db.js')

const DEFAULTS = {
  username: '',
  twitchInfo: {},
  exp: 0,
  money: 100,
  moneyTransactions: []
}

class User {

  static createNew(twitchInfo){
    return new User({
      username: twitchInfo.login,
      twitchInfo: twitchInfo
    })
  }

  constructor(userRecord){
    this.userRecord = fixBackwardsCompatibility(userRecord)
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
  const user = User.createNew(twitchInfo)
  user.save()
  return user
}

module.exports = { load, create }
