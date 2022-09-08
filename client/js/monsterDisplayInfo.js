import { toDisplayName } from '../../game/utilFunctions.js'

export function monsterDisplayName(monsterInstance){
  return monsterInstance.monsterDef.displayName ?? toDisplayName(monsterInstance.fighterData.name)
}