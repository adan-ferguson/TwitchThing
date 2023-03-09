import BaseItems from '../../game/items/combined.js'
import { v4 } from 'uuid'
import Picker from '../../game/picker.js'
import AdventurerItemInstance from '../../game/adventurerSlotInstance.js'
import AdventurerItem from '../../game/adventurerItem.js'
import AdventurerSlotInstance from '../../game/adventurerSlotInstance.js'

export const ITEM_RARITIES = [
  {
    name: 'common',
    weight: 90,
    value: 3
  },
  {
    name: 'uncommon',
    weight: 30,
    value: 8
  },
  {
    name: 'rare',
    weight: 10,
    value: 19
  }
]

export function getItemRarity(val = 0){
  return ITEM_RARITIES[val ?? 0]
}

export function generateItemDef({ group, name }){
  if(!BaseItems[group][name]){
    throw `Invalid base item type: ${group} / ${name}`
  }
  return {
    id: v4(),
    created: new Date(),
    isNew: true,
    baseType: { group, name }
  }
}

export function getItemPicker(value, validClasses){
  return new Picker(BaseItems, {
    weightFormula: baseItemDef => {
      const item = new AdventurerItemInstance(baseItemDef)
      const rarityInfo = item.rarityInfo
      if(rarityInfo.name !== 'common' && value < rarityInfo.value){
        return 0
      }
      if(item.orbs.classes.find(cls => validClasses.indexOf(cls) === -1)){
        return 0
      }
      if(item.orbs.classes.length > 1){
        return 10000
      }
      return rarityInfo.weight
    }
  })
}

export function chooseRandomBasicItem(chestLevel, validClasses){
  return getItemPicker(chestLevel, validClasses).pickOne()
}

export function validateAllItems(){
  for(let group in BaseItems){
    for(let name in BaseItems[group]){
      const item = new AdventurerItem({ group, name })
      if(!item.isValid){
        throw `Adventurer Item not valid (base item): ${name}`
      }
      // const slotEffect = new AdventurerSlotInstance({ item })
      // if(!slotEffect.isValid){
      //   throw `Adventurer Item not valid (slot effect): ${name}`
      // }
    }
  }
}