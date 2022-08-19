import BaseItems from '../../game/items/combined.js'
import { v4 } from 'uuid'
import Picker from '../../game/picker.js'

const itemPicker = new Picker(BaseItems.all, {
  valueFormula: baseItemDef => baseItemDef.orbs,
  lowerDeviation: 0.7,
  higherDeviation: 0.55
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