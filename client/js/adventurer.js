import { getAdventurerOrbsData } from '../../game/adventurer.js'
import ItemInstance from '../../game/item.js'
import ItemDetails from './components/itemDetails.js'
import StatsList from './components/stats/statsList.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'

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
  const itemInstance = new ItemInstance(itemDef)
  return {
    obj: itemInstance,
    orbs: itemInstance.orbs,
    name: itemInstance.displayName,
    isNew: itemInstance.itemDef.isNew,
    makeTooltip: () => {
      const statsList = new StatsList()
      statsList.setOptions({
        showTooltips: false,
        statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
      })
      statsList.setStats(itemInstance.stats)
      return statsList
    },
    makeDetails: () => {
      return new ItemDetails(itemInstance)
    }
  }
}