import AdventurerInstance from '../../game/adventurerInstance.js'
import _ from 'lodash'
import { adjustInventoryBasics, adjustInventoryCrafted } from './inventory.js'

/**
 * Throw an http exception if this loadout transaction is invalid. The parameters are all
 * assumed to have been processed, i.e. they are a non-null adventurer, user, and item id array.
 * @param adventurer [AdventurerDoc]
 * @param user [UserDoc]
 * @param newItems [string]
 */
export function commitAdventurerLoadout(adventurer, user, newItems){

  newItems = convertFromAjaxData(adventurer, user, newItems)

  const basicItemDiff = calcBasicItemDiff(adventurer.items, newItems)
  adjustInventoryBasics(user, basicItemDiff)

  const { added, removed } = calcCraftedItemDiff(adventurer.items, newItems)
  adjustInventoryCrafted(user, added, removed)

  adventurer.items = newItems
  validateLoadout(adventurer)
}

function calcBasicItemDiff(oldLoadout, newLoadout){
  const diff = {}
  count(oldLoadout)
  count(newLoadout, -1)
  function count(items, increment = 1){
    items.filter(i => i && !i.id).forEach(({ group, name }) => {
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
  const adv = new AdventurerInstance(adventurer)
  if(!adv.isLoadoutValid){
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
    if(_.isString(val)){
      return adventurer.items.find(item => item?.id === val) ?? user.inventory.items.crafted[val] ?? null
    }
    return val
  })
}