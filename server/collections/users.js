import Adventurers from './adventurers.js'
import Collection from './collection.js'
import { emit } from '../socketServer.js'

const DEFAULTS = {
  _id: null,
  magicID: null,
  iat: 0,
  auth: {
    type: 'none'
  },
  creationTime: Date.now(),
  displayname: null,
  adventurers: [],
  accomplishments: {
    deepestFloor: 1,
    firstRunFinished: 0,
    chestsFound: 0,
    advClasses: {},
  },
  rewards: {
    zonesCleared: []
  },
  features: { // featureName: 0 = locked, 1 = unlocked & brand new, 2 = unlocked
    editLoadout: 0,
    spendPoints: 0,
    skills: 0,
    gold: 0,
    dungeonPicker: 0,
    shop: 0,
    workshop: 0,
    superDungeon: 0,
    advClasses: {
      fighter: 2,
      mage: 2,
      paladin: 2,
      rogue: 0,
      chimera: 0
    },
  },
  inventory: {
    adventurerSlots: 1,
    gold: 0,
    scrap: 0,
    stashedXp: 0,
    items: {
      basic: {},
      crafted: {}
    }
  }
}

const Users = new Collection('users', DEFAULTS)

Users.validateSave = function(userDoc){
  if(userDoc.gameData){
    throw 'Tried to save a gameData user document'
  }
}

Users.loadFromMagicID = async function(magicID){
  const results = await Users.find({
    query: {
      magicID
    }
  })
  return results[0]
}

Users.deserializeFromSession = async function(obj){
  if(!obj){
    return null
  }else if(obj.userID){
    // new
    return await Users.findByID(obj.userID)
  }else{
    // old
    return await Users.loadFromMagicID(obj)
  }
}

Users.create = async function(magicID, iat, email, provider){
  return await Users.save({
    magicID,
    iat,
    auth: { type: provider, email }
  })
}

Users.createAnonymous = async function(){
  return await Users.save({
    displayName: 'generic_user_with_underscores'
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
  const user = await Users.findOne({
    query: {
      displayname
    }
  })
  if(user){
    return `Display name '${displayname}' is taken.`
  }
  userDoc.displayname = displayname
  await Users.save(userDoc)
}

Users.newAdventurer = async function(userDoc, adventurername){
  const availableSlots = userDoc.inventory.adventurerSlots - userDoc.adventurers.length
  if(availableSlots <= 0){
    throw { message: 'No slots available.', code: 403 }
  }
  const startingClass = userDoc.accomplishments.firstRunFinished ? null : 'fighter'
  const adventurerDoc = await Adventurers.createNew(userDoc._id, adventurername, startingClass)
  userDoc.adventurers.push(adventurerDoc._id)
  await Users.save(userDoc)
  return adventurerDoc
}

Users.isSetupComplete = function isSetupComplete(userDoc){
  return userDoc.displayname ? true : false
}

Users.gameData = async function(userDoc){
  if(!userDoc){
    return null
  }
  const filteredData = {
    ...userDoc,
    isAdmin: Users.isAdmin(userDoc),
    gameData: true
  }
  filteredData.isAdmin = Users.isAdmin(userDoc)
  filteredData.isRegistered = filteredData.magicID ? true : false
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
  const users = await Users.find()
  await Promise.all(users.map(async userDoc => {
    await Users.save({
      ...DEFAULTS,
      _id: userDoc._id,
      magicID: userDoc.magicID,
      iat: userDoc.iat,
      auth: userDoc.auth,
      displayname: userDoc.displayname,
      creationTime: Date.now(),
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

Users.saveAndEmit = async function(doc){
  const result = await this.save(doc)
  emit(doc._id.toString(), 'user updated', await Users.gameData(doc))
  return result
}

export default Users