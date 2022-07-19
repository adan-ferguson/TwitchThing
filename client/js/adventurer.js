import { getAdventurerOrbsData } from '../../game/adventurer.js'
import ItemInstance from '../../game/item.js'
import ItemDetails from './components/itemDetails.js'
import StatsList from './components/stats/statsList.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'
import { wrap } from '../../game/utilFunctions.js'

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

      const tt = document.createElement('div')

      if(itemInstance.stats){
        const statsList = new StatsList()
        statsList.setOptions({
          showTooltips: false,
          statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
        })
        statsList.setStats(itemInstance.stats)
        tt.appendChild(statsList)
      }

      if(itemInstance.description){
        tt.appendChild(wrap(itemInstance.description, 'div'))
      }

      return tt
    },
    makeDetails: () => {
      return new ItemDetails(itemInstance)
    }
  }
}