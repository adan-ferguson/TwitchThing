import Adventurer from '../../game/adventurer.js'
import _ from 'lodash'
import { adjustInventoryBasics, adjustInventoryCrafted } from '../user/inventory.js'

/**
 * Throw an http exception if this loadout transaction is invalid. The parameters are all
 * assumed to have been processed, i.e. they are a non-null adventurer, user, and item id array.
 * @param adventurerDoc [AdventurerDoc]
 * @param user [UserDoc]
 * @param newItems [string]
 * @param newSkills
 */
export function commitAdventurerLoadout(adventurerDoc, user, newItems, newSkills){
  setItems(adventurerDoc, user, newItems)
  setSkills(adventurerDoc, newSkills)
  validateLoadout(adventurerDoc)
}

function setItems(adventurerDoc, user, newItems){
  newItems = convertFromAjaxData(adventurerDoc, user, newItems)
  const basicItemDiff = calcBasicItemDiff(adventurerDoc.loadout.items, newItems)
  adjustInventoryBasics(user, basicItemDiff)
  const { added, removed } = calcCraftedItemDiff(adventurerDoc.loadout.items, newItems)
  adjustInventoryCrafted(user, added, removed)
  adventurerDoc.loadout.items = newItems
}

function setSkills(adventurerDoc, newSkills){
  const obj = {}
  if(newSkills.length !== 8){
    throw { code: 403, error: 'Skills array length is wrong.' }
  }
  newSkills.filter(s => s).forEach(skillId => {
    if(!adventurerDoc.unlockedSkills[skillId]){
      throw { code: 403, error: 'Attempted to equip skill which was not unlocked.' }
    }
    if(obj[skillId]){
      throw { code: 403, error: 'Attempt to equip the same skill twice.' }
    }
    obj[skillId] = 1
  })
  adventurerDoc.loadout.skills = newSkills
}

function calcBasicItemDiff(oldLoadout, newLoadout){
  const diff = {}
  count(oldLoadout)
  count(newLoadout, -1)
  function count(items, increment = 1){
    items.filter(i => i && !i.id).forEach(baseItemId => {
      if(!diff[baseItemId]){
        diff[baseItemId] = 0
      }
      diff[baseItemId] += increment
    })
  }
  return diff
}

function calcCraftedItemDiff(oldLoadout, newLoadout){

  return {
    added: diff(oldLoadout, newLoadout),
    removed: diff(newLoadout, oldLoadout)
  }

  function diff(defs1, defs2){
    return defs1.filter(i => {
      if(!i || !i.id){
        return false
      }
      return defs2.find(i2 => i.id === i2?.id) ? false : true
    })
  }
}

function validateLoadout(adventurer){
  const adv = new Adventurer(adventurer)
  if(!adv.orbsData.isValid || !adv.loadout.isValid){
    throw { code: 403, error: 'Loadout is invalid.' }
  }
}

/**
 * @param adventurer
 * @param user
 * @param newItems {[itemDef|string]} Potential dangerous value, prevent duping!
 */
function convertFromAjaxData(adventurer, user, newItems){
  return newItems.map(val => {
    // if(!_.isString(val)){
    //   const id = val.id
    //   return adventurer.loadout.items.find(item => item?.id === val) ?? user.inventory.items.crafted[val] ?? null
    // }
    return val
  })
}