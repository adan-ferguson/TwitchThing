const db = require('../db.js')

module.exports = {
  load: async (twitchId) => {
    return await db.conn().collection('users').findOne({
      twitchId: twitchId
    })
  },
  create: async (userInfo) => {
    const user = {
      twitchId: userInfo.id,
      twitchInfo: userInfo
    }
    await db.conn().collection('users').save(user)
    return user
  }
}
