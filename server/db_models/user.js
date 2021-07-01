const db = require('../db.js')

const DEFAULTS = {
  exp: 0,
  money: 100
}

async function load(twitchId){
  const user = await db.conn().collection('users').findOne({
    twitchId: twitchId
  })
  if(user){
    return fixBackwardsCompatibility(user)
  }
}

async function create(userInfo){
  const user = Object.assign(DEFAULTS, {
    twitchId: userInfo.id,
    twitchInfo: userInfo
  })
  await db.conn().collection('users').save(user)
  return user
}

module.exports = { load,create }

function fixBackwardsCompatibility(user){
  return Object.assign(DEFAULTS, user)
}