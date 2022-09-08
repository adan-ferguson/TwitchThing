import MonsterItemInstance from '../../game/monsterItemInstance.js'
import StatsList from './components/stats/statsList.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'
import { wrap } from '../../game/utilFunctions.js'
import MonsterInstance from '../../game/monsterInstance.js'

export function monsterLoadoutContents(monster){
  return {
    getOrbsData: loadoutItems => {
      const mi = new MonsterInstance({
        ...monster,
        items: loadoutItems.map(li => li?.obj)
      })
      return mi.orbsData
    },
    loadoutItems: monster.items.map(monsterLoadoutItem)
  }
}

export function monsterLoadoutItem(itemDef){
  if(!itemDef){
    return null
  }
  const itemInstance = new MonsterItemInstance(itemDef)
  return {
    obj: itemInstance,
    name: itemInstance.name,
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
    }
  }
}