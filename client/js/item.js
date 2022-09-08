import { toDisplayName } from '../../game/utilFunctions.js'

export function itemDisplayName(itemInstance){
  return itemInstance.itemData.displayName ?? toDisplayName(itemInstance.itemData.name)
}