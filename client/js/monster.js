import { getMonsterOrbsData } from '../../game/monster.js'
import MonsterAbilityInstance from '../../game/monsterAbility.js'
import StatsList from './components/stats/statsList.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'
import { wrap } from '../../game/utilFunctions.js'

export function monsterLoadoutContents(monster){
  return {
    getOrbsData: loadoutItems => {
      return getMonsterOrbsData({ ...monster, mods: loadoutItems.map(li => li?.obj) })
    },
    loadoutItems: monster.abilities.map(monsterLoadoutItem)
  }
}

export function monsterLoadoutItem(abilityDef){
  if(!abilityDef){
    return null
  }
  const abilityInstance = new MonsterAbilityInstance(abilityDef)
  return {
    obj: abilityInstance,
    name: abilityInstance.name,
    makeTooltip: () => {

      const tt = document.createElement('div')

      if(abilityInstance.stats){
        const statsList = new StatsList()
        statsList.setOptions({
          showTooltips: false,
          statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
        })
        statsList.setStats(abilityInstance.stats)
        tt.appendChild(statsList)
      }

      if(abilityInstance.description){
        tt.appendChild(wrap(abilityInstance.description, {
          class: 'subtitle'
        }))
      }

      return tt
    }
  }
}