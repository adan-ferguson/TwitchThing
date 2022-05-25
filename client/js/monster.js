import { getMonsterOrbsData } from '../../game/monster.js'

export function monsterLoadoutContents(monster){
  return {
    getOrbsData: loadoutItems => {
      return getMonsterOrbsData({ ...monster, mods: loadoutItems.map(li => li?.obj) })
    },
    loadoutItems: monster.mods.map(modDef => {
      if(!modDef){
        return null
      }
      if(modDef.baseType){
        // TODO: something
      }
      return {
        obj: modDef,
        orbs: null,
        name: modDef.name,
        makeTooltip: () => {
          const div = document.createElement('div')
          div.textContent = 'a'
          return div
        },
        makeDetails: null
        //   (loadoutItem) => {
        //   return new ItemDetails(loadoutItem)
        // }
      }
    })
  }
}