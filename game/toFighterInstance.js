import MonsterInstance from './monsterInstance.js'
import AdventurerInstance from './adventurerInstance.js'

export function toFighterInstance(def, state = {}){
  return def.baseType ? new MonsterInstance(def, state) : new AdventurerInstance(def, state)
}