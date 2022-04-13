import Adventurers from '../collections/adventurers.js'
import Users from '../collections/users.js'
import OrbsData from '../../game/orbsData.js'

/**
 * Throw an http exception if this loadout transaction is invalid. The parameters are all
 * assumed to have been processed, i.e. they are a non-null adventurer, user, and item id array.
 * @param adventurer [AdventurerDoc]
 * @param user [UserDoc]
 * @param itemIDs [string]
 */
export async function saveAdventurerLoadout(adventurer, user, itemIDs){

  const currentLoadout = adventurer.loadout
  const currentInventory = user.items
  const loadoutInfo = getItems(currentLoadout, itemIDs)
  const invInfo = getItems(currentInventory, loadoutInfo.missingIDs)

  if(invInfo.missingIDs.length){
    throw { code: 403, error: `Item(s) not found in user's inventory, User: ${user._id}, Items: ${JSON.stringify(invInfo.missingIDs)}` }
  }

  updateLoadout(currentLoadout, currentInventory, itemIDs)
  updateInventory(currentInventory, loadoutInfo.unmatchedItems, Object.keys(invInfo.matchedItems))

  validateLoadout(adventurer)

  await Promise.all([
    Adventurers.save(adventurer),
    Users.save(user)
  ])
}

function getItems(itemArrayOrObj, ids){
  const itemObj = toObj(itemArrayOrObj)
  const matchedItems = []
  const missingIDs = []
  ids.forEach(id => {
    if(!id){
      return
    }
    const item = itemObj[id]
    if(item){
      matchedItems.push(item)
      delete itemObj[id]
    }else{
      missingIDs.push(id)
    }
  })

  return { matchedItems, unmatchedItems: Object.values(itemObj), missingIDs }
}

function updateInventory(inventory, itemsToAdd, idsToRemove){
  idsToRemove.forEach(id => delete inventory[id])
  itemsToAdd.forEach(item => inventory[item.id] = item)
}

function updateLoadout(loadout, inventory, ids){
  const loadoutObj = toObj(loadout)
  for(let i = 0; i < ids; i++){
    const id = ids[i]
    if(!id){
      loadout[i] = null
    }else{
      loadout[i] = loadoutObj[id] || inventory[id]
    }
  }
}

function validateLoadout(adventurer){
  const orbsData = new OrbsData(adventurer)
  if(!orbsData.isValid){
    throw { code: 403, error: 'Loadout orbs are invalid.' }
  }
}

function toObj(arrayOrObj, key = 'id'){
  if(Array.isArray(arrayOrObj)){
    const itemObj = {}
    arrayOrObj.forEach(o => itemObj[o][key] = o)
    return itemObj
  }
  return arrayOrObj
}