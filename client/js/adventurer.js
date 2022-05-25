import { getAdventurerOrbsData } from '../../game/adventurer.js'
import { getItemDisplayName, getItemOrbs } from '../../game/item.js'
import ItemDetails from './components/itemDetails.js'

export function adventurerLoadoutContents(adventurer){
  return {
    getOrbsData: loadoutItems => {
      return getAdventurerOrbsData({ ...adventurer, items: loadoutItems.map(li => li?.obj) })
    },
    loadoutItems: adventurer.items.map(adventurerLoadoutItem)
  }
}

export function adventurerLoadoutItem(itemDef){
  if(!itemDef){
    return null
  }
  return {
    obj: itemDef,
    orbs: getItemOrbs(itemDef),
    name: getItemDisplayName(itemDef),
    isNew: itemDef.isNew,
    makeTooltip: () => {
      const div = document.createElement('div')
      div.textContent = 'a'
      return div
    },
    makeDetails: (loadoutItem) => {
      return new ItemDetails(loadoutItem)
    }
  }
}