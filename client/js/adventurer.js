import { getAdventurerOrbsData } from '../../game/adventurer.js'
import { makeLoadoutItem } from './loadoutItem.js'
import { getBaseItemType, getItemDisplayName } from '../../game/item.js'
import ItemDetails from './components/itemDetails.js'

export function adventurerLoadoutContents(adventurer){
  return {
    getOrbsData: loadoutItems => {
      return getAdventurerOrbsData({ ...adventurer, items: loadoutItems.map(li => li?.item) })
    },
    loadoutItems: adventurer.items.map(adventurerLoadoutItem)
  }
}

export function adventurerLoadoutItem(itemDef){
  if(!itemDef){
    return null
  }
  const baseType = getBaseItemType(itemDef)
  return makeLoadoutItem({
    item: itemDef,
    orbs: baseType.orbs,
    name: getItemDisplayName(itemDef),
    makeTooltip: () => {
      const div = document.createElement('div')
      div.textContent = 'a'
      return div
    },
    makeDetails: (loadoutItem) => {
      return new ItemDetails(loadoutItem)
    }
  })
}