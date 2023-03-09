import MonsterInstance from './monsterInstance.js'
import Adventurer from './adventurer.js'

export function toFighterInstance(def, state = {}){
  return def.baseType ? new MonsterInstance(def, state) : new Adventurer(def, state)
}