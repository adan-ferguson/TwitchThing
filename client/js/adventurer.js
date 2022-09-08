import AdventurerItemInstance from '../../game/adventurerItemInstance.js'
import ItemDetails from './components/itemDetails.js'
import StatsList from './components/stats/statsList.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'
import { wrap } from '../../game/utilFunctions.js'
import AdventurerInstance from '../../game/adventurerInstance.js'
import { itemDisplayName } from './item.js'

export function adventurerLoadoutContents(adventurer){
  return {
    getOrbsData: loadoutItems => {
      return new AdventurerInstance({
        ...adventurer,
        items: loadoutItems.map(li => li?.obj)
      }).orbs
    },
    loadoutItems: adventurer.items.map(adventurerLoadoutItem)
  }
}

export function adventurerLoadoutItem(itemDef){
  if(!itemDef){
    return null
  }
  const itemInstance = new AdventurerItemInstance(itemDef)
  return {
    obj: itemInstance,
    orbs: itemInstance.orbs,
    name: itemDisplayName(itemInstance),
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
        tt.appendChild(wrap(itemInstance.description, {
          class: 'subtitle'
        }))
      }

      return tt
    },
    makeDetails: () => {
      return new ItemDetails(itemInstance)
    }
  }
}