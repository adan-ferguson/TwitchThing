import BaseItems from '../../game/items/combined.js'
import { v4 } from 'uuid'
import Picker from '../../game/picker.js'

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
    value: 15
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

export function getItemPicker(value, specificClass = false){
  return new Picker(BaseItems, {
    weightFormula: baseItemDef => {
      const rarity = ITEM_RARITIES[baseItemDef.rarity ?? 0]
      if(rarity.name !== 'common' && value < rarity.value){
        return 0
      }
      if(specificClass && baseItemDef.group !== specificClass){
        return 0
      }
      return rarity.weight
    }
  })
}

export function chooseRandomBasicItem(chestLevel, specificClass = null){
  return getItemPicker(chestLevel, specificClass).pickOne()
}