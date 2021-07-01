const db = require('../db.js')
const Channels = require('./channels')

const DEFAULTS = {
  exp: 0,
  money: 100
}

async function load(twitchId){

  const user = await db.conn().collection('users').findOne({
    twitchId: twitchId
  })

  if(user){
    fixBackwardsCompatibility(user)
  }

  return user
}

async function loadExtendedInfo(user){
  user.channel = await Channels.get(user.twitchInfo.display_name)
}

async function create(userInfo){
  const user = Object.assign(DEFAULTS, {
    twitchId: userInfo.id,
    twitchInfo: userInfo
  })
  await db.conn().collection('users').save(user)
  return user
}

function fixBackwardsCompatibility(user){
  return Object.assign(DEFAULTS, user)
}

module.exports = { load,loadExtendedInfo,create }
