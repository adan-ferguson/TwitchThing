import Adventurers from './adventurers.js'
import Collection from './collection.js'
import db from '../db.js'
import { emit } from '../socketServer.js'

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
    deepestFloor: 1,
    firstRunFinished: 0,
    chestsFound: 0
  },
  features: { // featureName: 0 = locked, 1 = unlocked & brand new, 2 = unlocked
    editLoadout: 0,
    dungeonPicker: 0,
    shop: 1,
    advClasses: {
      fighter: 2,
      tank: 2,
      ranger: 2
    }
  },
  inventory: {
    adventurerSlots: 1,
    gold: 100000,
    scrap: 0,
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
  const user = await Users.findByID(displayname)
  if(user){
    return `Display name '${displayname}' is taken.`
  }
  userDoc.displayname = displayname
  await Users.save(userDoc)
}

Users.newAdventurer = async function(userDoc, adventurername, startingClass){
  const availableSlots = userDoc.inventory.adventurerSlots - userDoc.adventurers.length
  if(availableSlots <= 0){
    throw { message: 'No slots available.', code: 403 }
  }
  // TODO: prevent duplicates?
  const adventurerDoc = await Adventurers.createNew(userDoc._id, adventurername, startingClass)
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
  const users = await Users.find()
  await Promise.all(users.map(async userDoc => {
    await Users.save({
      ...DEFAULTS,
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

Users.saveAndEmit = async function(doc){
  const result = await this.save(doc)
  emit(doc._id.toString(), 'user updated', Users.gameData(doc))
  return result
}

/**
 * Non-saving. Do this before granting the effect, because this will throw
 * if user doesn't have enough gold.
 */
Users.spendGold = function(doc, price){
  if(price > doc.inventory.gold){
    throw { message: 'Not enough gold for transaction' }
  }
  doc.inventory.gold -= price
}

export default Users