import Items from './items/combined.js'
import { toDisplayName } from './utilFunctions.js'

export function getBaseItemType(itemDef){
  return Items[itemDef.group][itemDef.name]
}

export function getItemDisplayName(itemDef){
  const baseType = getBaseItemType(itemDef)
  return itemDef.displayName || baseType.displayName || toDisplayName(baseType.name)
}

export function getItemStats(itemDef){
  return getBaseItemType(itemDef).stats
}