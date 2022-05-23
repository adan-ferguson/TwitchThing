import BaseItems from '../../game/items/combined.js'
import { v4 } from 'uuid'
import Picker from '../../game/picker.js'

const itemPicker = new Picker(BaseItems, {
  valueFormula: baseItemDef => baseItemDef.orbs
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

export function generateRandomItemDef(val){
  const baseType = itemPicker.pick(val)
  return generateItemDef(baseType)
}