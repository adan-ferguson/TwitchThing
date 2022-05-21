import { getMonsterOrbsData } from '../../game/monster.js'

export function monsterLoadoutContents(monster){
  return {
    getOrbsData: loadoutItems => {
      return getMonsterOrbsData({ ...monster, mods: loadoutItems.map(li => li.mod) })
    },
    loadoutItems: monster.mods.map(modDef => {

    })
  }
}