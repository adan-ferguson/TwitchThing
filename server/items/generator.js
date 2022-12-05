import BaseItems from '../../game/items/combined.js'
import { v4 } from 'uuid'
import Picker from '../../game/picker.js'

const itemPicker = new Picker(BaseItems, {
  valueFormula: baseItemDef => baseItemDef.orbs,
  levelFormula: level => level / 5,
  lowerDeviation: 0.95,
  higherDeviation: 0.4
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

export function getItemPicker(){
  return itemPicker
}

export function chooseRandomBasicItem(chestLevel, specificClass = null){
  return itemPicker.pick(chestLevel, itemDef => {
    return specificClass ? itemDef.group === specificClass : true
  })
}

export function generateTestInventory(itemsObj){
  Object.values(BaseItems.fighter).forEach(i => {
    const itemDef = generateItemDef(BaseItems.fighter[i])
    itemsObj[itemDef.id] = itemDef
  })
}