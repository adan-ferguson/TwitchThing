import BaseItems from '../../game/items/combined.js'
import { v4 } from 'uuid'
import Picker from '../../game/picker.js'

const itemPicker = new Picker(BaseItems, {
  valueFormula: baseItemDef => baseItemDef.orbs
})

export function generateItemDef(baseTypeName){
  if(!BaseItems[baseTypeName]){
    throw 'Invalid item base type: ' + baseTypeName
  }
  return {
    id: v4(),
    baseType: baseTypeName
  }
}

export function generateRandomItemDef(val){
  const baseType = itemPicker.pick(val)
  return generateItemDef(baseType)
}