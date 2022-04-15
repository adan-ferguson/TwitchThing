import Monsters from '../../game/monsters/combined.js'

const monstersByFloor = {
  1: Monsters.RAT,
  2: Monsters.TROGLODYTE,
  3: Monsters.BAT,
  4: Monsters.KOBOLD,
  5: Monsters.OOZE,
  6: Monsters.SPIDER,
  7: Monsters.SCORPION,
  8: Monsters.ROCKGOLEM,
  9: Monsters.SORCERER,
  10: Monsters.MINOTAUR
}

export function getMonsterDefinition(floor, rarity = 1){
  floor = Math.max(1, floor)
  if(rarity === 1){
    return getBasicMonsterDefinition(floor)
  }
  throw 'Non-basic monsters not implemented yet'
}

export function getBasicMonsterDefinition(floor){
  floor = ((floor - 1) % 100) + 1
  return monstersByFloor[floor] || getBasicMonsterDefinition(floor - 1)
}