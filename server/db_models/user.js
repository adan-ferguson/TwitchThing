const db = require('../db.js')

const DEFAULTS = {
  exp: 0,
  money: 0
}

module.exports = {
  load: async (twitchId) => {
    const user = await db.conn().collection('users').findOne({
      twitchId: twitchId
    })
    if(user){
      return fixCompatibility(user)
    }
  },
  create: async (userInfo) => {
    const user = Object.assign(DEFAULTS, {
      twitchId: userInfo.id,
      twitchInfo: userInfo
    })
    await db.conn().collection('users').save(user)
    return user
  }
}

function fixCompatibility(user){
  return Object.assign(DEFAULTS, user)
}