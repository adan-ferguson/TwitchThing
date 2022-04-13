import Monsters from '../../game/monsters/combined.js'

const monstersByFloor = {
  1: Monsters.RAT,
  3: Monsters.SKELETON,
  5: Monsters.BAT,
  7: Monsters.GOLEM
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
  const monsterDef = monstersByFloor[floor] || getBasicMonsterDefinition(floor - 1)
  return tierUpMonsterDef(monsterDef, Math.ceil(floor / 100))
}

////////////////////////////////////

function tierUpMonsterDef(monsterDef, tier){
  // TODO: this
  return monsterDef
}