import db from '../db.js'
import * as Adventurers from './adventurers.js'
import { emit } from '../socketServer.js'

const DEFAULTS = {
  magicID: null,
  iat: 0,
  auth: {
    type: 'none'
  },
  xp: 0,
  level: 1,
  displayname: null,
  adventurers: []
}

export async function save(userDoc){
  return await db.save(fix(userDoc), 'users')
}

function fix(userDoc, projection = null){
  return db.fix(userDoc, DEFAULTS, projection)
}

// emit(eventName, data){
//   log(this.username, eventName, data)
//   emit(this.username, eventName, data)
// }

export async function loadFromMagicID(magicID){
  const userDoc = await db.conn().collection('users').findOne({
    magicID
  })
  if(!userDoc){
    return null
  }
  return fix(userDoc)
}

export async function loadData(userDoc, searchObj = {}){
  const data = {}
  if(searchObj.adventurers){
    data.adventurers = await Adventurers.loadByIDs(userDoc.adventurers, searchObj.adventurers)
  }
  return data
}

export async function create(magicID, iat, email){
  const userDoc = fix({
    magicID,
    iat,
    auth: { type: 'email', email }
  })
  await save(userDoc)
  return userDoc
}

export async function login(userDoc, iat){
  if(userDoc.iat >= iat){
    throw `Replay attack detected for user ${userDoc.magicID}.`
  }
  userDoc.iat = iat
  await save(userDoc)
}

export async function loadGameData(userDoc){
  return {
    displayname: userDoc.displayname,
    xp: userDoc.xp,
    level: userDoc.level
  }
}

export async function setDisplayname(userDoc, displayname){
  displayname = displayname + ''
  if(displayname.length <= 1){
    return 'Display name must be between 2 and 15 letters.'
  }
  if(displayname.length > 15){
    return 'Display name must be between 2 and 15 letters.'
  }
  const user = await db.conn().collection('users').findOne({ displayname })
  if(user){
    return `Display name '${displayname}' is taken.`
  }
  userDoc.displayname = displayname
  await save(userDoc)
}

export async function newAdventurer(userDoc, adventurername){
  // TODO: check for slots
  const availableSlots = 1 - userDoc.adventurers.length
  if(availableSlots <= 0){
    throw { message: 'No slots available.', code: 403 }
  }
  const adventurerDoc = await Adventurers.createNew(userDoc._id, adventurername)
  userDoc.adventurers.push(adventurerDoc._id)
  await save(userDoc)
  return adventurerDoc
}

export function isSetupComplete(userDoc){
  return userDoc.displayname ? true : false
}