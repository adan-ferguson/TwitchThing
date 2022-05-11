import Monsters from '../../game/monsters/combined.js'

const monstersByFloor = {
  // Caves
  1: Monsters.RAT,
  2: Monsters.TROGLODYTE,
  3: Monsters.BAT,
  4: Monsters.KOBOLD,
  5: Monsters.OOZE,
  6: Monsters.SPIDER,
  7: Monsters.SCORPION,
  8: Monsters.ROCKGOLEM,
  9: Monsters.SORCERER,
  10: Monsters.MINOTAUR,
  // Crypt
  11: Monsters.SKELETON,
  12: Monsters.ZOMBIE,
  13: Monsters.WRAITH,
  14: Monsters.SHADE,
  15: Monsters.NECROMANCER,
  16: Monsters.BANSHEE,
  17: Monsters.LICH,
  18: Monsters.VAMPIRE,
  19: Monsters.ABOMINATION,
  20: Monsters.BONEDRAGON
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
  if(!monstersByFloor[floor]){
    throw `Could not find monster for floor ${floor}`
  }
  return {
    level: floor,
    definition: monstersByFloor[floor]
  }
}