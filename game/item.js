import Items from './items/combined.js'
import { toDisplayName } from './utilFunctions.js'
import OrbsData from './orbsData.js'

export function getBaseItemType(itemDef){
  return Items[itemDef.baseType.group][itemDef.baseType.name]
}

export function getItemDisplayName(itemDef){
  const baseType = getBaseItemType(itemDef)
  return itemDef.displayName || baseType.displayName || toDisplayName(baseType.name)
}

export function getItemStats(itemDef){
  return getBaseItemType(itemDef).stats
}

export function getItemOrbsData(itemDef){
  const baseType = getBaseItemType(itemDef)
  return new OrbsData({ [baseType.group]: baseType.orbs })
}