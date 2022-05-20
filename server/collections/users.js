import Adventurers from './adventurers.js'
import Collection from './collection.js'

const DEFAULTS = {
  _id: null,
  magicID: null,
  iat: 0,
  auth: {
    type: 'none'
  },
  displayname: null,
  adventurers: [],
  accomplishments: {
    highestFloor: 0
  },
  features: { // featureName: 0 = locked, 1 = unlocked & brand new, 2 = unlocked
    items: 0,
    advClasses: {
      warrior: 2,
      mage: 2,
      ranger: 2
    }
  },
  inventory: {
    adventurerSlots: 1,
    items: {}
  }
}

const Users = new Collection('users', DEFAULTS)

Users.validateSave = function(userDoc){
  if(userDoc.gameData){
    throw 'Tried to save a gameData user document'
  }
}

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
  const availableSlots = userDoc.inventory.adventurerSlots - userDoc.adventurers.length
  if(availableSlots <= 0){
    throw { error: 'No slots available.', code: 403 }
  }
  // TODO: flexible starting bonuses
  const adventurerDoc = await Adventurers.createNew(userDoc._id, adventurername, 'warrior')
  userDoc.adventurers.push(adventurerDoc._id)
  await Users.save(userDoc)
  return adventurerDoc
}

Users.isSetupComplete = function isSetupComplete(userDoc){
  return userDoc.displayname ? true : false
}

Users.gameData = function(userDoc){
  if(!userDoc){
    return null
  }
  const filteredData = {
    ...userDoc,
    isAdmin: Users.isAdmin(userDoc),
    gameData: true
  }
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

Users.resetAll = async function(){
  const users = await Users.find({})
  await Promise.all(users.map(async userDoc => {
    await Users.save({
      _id: userDoc._id,
      magicID: userDoc.magicID,
      iat: userDoc.iat,
      auth: userDoc.auth,
      displayname: userDoc.displayname
    })
  }))
}

/**
 * Clear the "new" status of all of this user's items.
 * @param userDoc
 * @returns {Promise<void>}
 */
Users.clearNewItems = async function(userDoc){
  Object.values(userDoc.inventory.items).forEach(item => item.isNew = false)
  await Users.save(userDoc)
}

export default Users