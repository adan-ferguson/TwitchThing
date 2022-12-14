import AdventurerInstance from '../../game/adventurerInstance.js'
import { adjustInventoryBasics } from './inventory.js'

/**
 * Throw an http exception if this loadout transaction is invalid. The parameters are all
 * assumed to have been processed, i.e. they are a non-null adventurer, user, and item id array.
 * @param adventurer [AdventurerDoc]
 * @param user [UserDoc]
 * @param newItems [string]
 */
export function commitAdventurerLoadout(adventurer, user, newItems){
  const basicItemDiff = calcBasicItemDiff(adventurer.items, newItems)
  adventurer.items = newItems
  adjustInventoryBasics(user.inventory.items.basic, basicItemDiff)
  validateLoadout(adventurer)

  // TODO: incorporate this with non-basic items
  // validateDuplicates(items)

  // const currentInventory = user.inventory.items.basic
  // const loadoutInfo = getItems(currentLoadout, items)
  // const invInfo = getItems(currentInventory, loadoutInfo.missingIDs)

  // if(invInfo.missingIDs.length){
  //   throw { code: 403, error: `Item(s) not found in user's inventory, User: ${user._id}, Items: ${JSON.stringify(invInfo.missingIDs)}` }
  // }

  // updateLoadout(currentLoadout, currentInventory, items)
  // updateInventory(currentInventory, loadoutInfo.unmatchedItems, invInfo.matchedItems.map(item => item.id))
}

function calcBasicItemDiff(oldLoadout, newLoadout){
  const diff = {}
  count(oldLoadout)
  count(newLoadout, -1)
  function count(items, increment = 1){
    items.filter(i => i).forEach(({ group, name }) => {
      if(!diff[group]){
        diff[group] = {}
      }
      if(!diff[group][name]){
        diff[group][name] = 0
      }
      diff[group][name] += increment
    })
  }
  return diff
}

// function getItems(itemArrayOrObj, ids){
//   const itemObj = toObj(itemArrayOrObj)
//   const matchedItems = []
//   const missingIDs = []
//   ids.forEach(id => {
//     if(!id){
//       return
//     }
//     const item = itemObj[id]
//     if(item){
//       matchedItems.push(item)
//       delete itemObj[id]
//     }else{
//       missingIDs.push(id)
//     }
//   })
//
//   return { matchedItems, unmatchedItems: Object.values(itemObj), missingIDs }
// }
//
// function updateInventory(inventory, itemsToAdd, idsToRemove){
//   idsToRemove.forEach(id => delete inventory[id])
//   itemsToAdd.forEach(item => inventory[item.id] = item)
// }
//
// function updateLoadout(loadout, inventory, ids){
//   const loadoutObj = toObj(loadout)
//   for(let i = 0; i < ids.length; i++){
//     const id = ids[i]
//     if(!id){
//       loadout[i] = null
//     }else{
//       loadout[i] = loadoutObj[id] || inventory[id]
//     }
//   }
// }
//
// function validateDuplicates(itemIDs){
//   const obj = {}
//   for(let i = 0; i < itemIDs.length; i++){
//     const id = itemIDs[i]
//     if(id){
//       if(obj[id]){
//         throw { code: 403, error: 'Duplication detected.' }
//       }
//       obj[id] = 1
//     }
//   }
// }

function validateLoadout(adventurer){
  const orbsData = new AdventurerInstance(adventurer).orbs
  if(!orbsData.isValid){
    throw { code: 403, error: 'Loadout orbs are invalid.' }
  }
}

// function toObj(arrayOrObj, key = 'id'){
//   if(Array.isArray(arrayOrObj)){
//     const itemObj = {}
//     arrayOrObj.filter(o => o).forEach(o => itemObj[o[key]] = o)
//     return itemObj
//   }
//   return { ...arrayOrObj }
// }