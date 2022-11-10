import BaseItems, { all as allItems } from '../../game/items/combined.js'
import { v4 } from 'uuid'
import Picker from '../../game/picker.js'

const itemPicker = new Picker(BaseItems, {
  valueFormula: baseItemDef => baseItemDef.orbs,
  lowerDeviation: 0.9,
  higherDeviation: 0.5
})

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

export function generateRandomItemDef(chestLevel){
  const baseType = itemPicker.pick(chestLevel / 3)
  return generateItemDef(baseType)
}

export function generateTestInventory(itemsObj){
  Object.values(BaseItems.fighter).forEach(i => {
    const itemDef = generateItemDef(i)
    itemsObj[itemDef.id] = itemDef
  })
}