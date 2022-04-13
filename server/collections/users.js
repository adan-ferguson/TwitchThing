import Adventurers from './adventurers.js'
import Collection from './collection.js'
import { levelToAdventurerSlots } from '../../game/user.js'

const DEFAULTS = {
  magicID: null,
  iat: 0,
  auth: {
    type: 'none'
  },
  xp: 0,
  level: 1,
  displayname: null,
  adventurers: [],
  inventory: {
    items: []
  }
}

const Users = new Collection('users', DEFAULTS)

Users.loadFromMagicID = async function(magicID){
  return await Users.findOne({
    magicID
  })
}

Users.create = async function(magicID, iat, email, provider){
  return await Users.save({
    magicID,
    iat,
    auth: { type: provider, email }
  })
}

Users.login = async function(userDoc, iat){
  if(userDoc.iat >= iat){
    throw `Replay attack detected for user ${userDoc.magicID}.`
  }
  userDoc.iat = iat
  await Users.save(userDoc)
}

Users.setDisplayname = async function(userDoc, displayname){
  displayname = displayname + ''
  if(displayname.length <= 1){
    return 'Display name must be between 2 and 15 letters.'
  }
  if(displayname.length > 15){
    return 'Display name must be between 2 and 15 letters.'
  }
  const user = await Users.findOne({ displayname })
  if(user){
    return `Display name '${displayname}' is taken.`
  }
  userDoc.displayname = displayname
  await Users.save(userDoc)
}

Users.newAdventurer = async function(userDoc, adventurername){
  const availableSlots = levelToAdventurerSlots(userDoc.level)  - userDoc.adventurers.length
  if(availableSlots <= 0){
    throw { error: 'No slots available.', code: 403 }
  }
  const adventurerDoc = await Adventurers.createNew(userDoc._id, adventurername)
  userDoc.adventurers.push(adventurerDoc._id)
  await Users.save(userDoc)
  return adventurerDoc
}

Users.isSetupComplete = function isSetupComplete(userDoc){
  return userDoc.displayname ? true : false
}

Users.gameData = function(userDoc){
  const filteredData = { ...userDoc }
  filteredData.isAdmin = Users.isAdmin(userDoc)
  delete filteredData.magicID
  delete filteredData.iat
  delete filteredData.auth
  return filteredData
}

Users.isAdmin = function(userDoc){
  if(userDoc.auth.type === 'google' && userDoc.auth.email === 'mrdungeorama@gmail.com'){
    return true
  }
  return false
}

export default Users