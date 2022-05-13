import scaledValue from '../../game/scaledValue.js'
import { StatDefinitions, StatType } from '../../game/stats/statDefinitions.js'
import { generateRandomChest } from './chests.js'
import { chooseOne } from '../../game/rando.js'
import Monsters from '../../game/monsters/combined.js'
import { levelToHp, levelToPower, levelToXpReward } from '../../game/monster.js'

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

const CHEST_DROP_CHANCE = 0.05
const MONSTER_CHANCE_INCREASE_PER_ROOM = 0.06

// Monsters of level [currentFloor - FLOOR_RANGE] to [currentFloor] will spawn (both inclusive).
const FLOOR_RANGE = 4

// How much to skew RNG towards higher levels.
const FLOOR_SKEW = 0.1

export function foundMonster(dungeonRun){
  const monsterChance = (roomsSinceMonster() - 1) * MONSTER_CHANCE_INCREASE_PER_ROOM
  return Math.random() < monsterChance
  function roomsSinceMonster(){
    let i
    for(i = 1; i <= dungeonRun.events.length; i++){
      if(dungeonRun.events.at(-i)?.monster){
        break
      }
    }
    return i
  }
}

export async function generateMonster(dungeonRun){

  const level = floorToLevel(dungeonRun.floor)
  const monsterDefinition = getMonsterDefinition(level)

  return {
    ...monsterDefinition,
    baseHp: levelToHp(level),
    basePower: levelToPower(level),
    rewards: generateRewards()
  }

  function generateRewards(){
    const rewards = {
      xp: levelToXpReward(level)
    }
    if(dungeonRun.user.features.items){
      if(Math.random() < CHEST_DROP_CHANCE){
        rewards.chests = generateRandomChest(dungeonRun)
      }
    }
    return rewards
  }
}

/**
 * Given a floor, return a random level equal to this floor or less, but it has to be
 * the same zone (aka the tens digit must remain the same).
 * @param floor
 */
function floorToLevel(floor){
  return chooseOne(generateFloorChoices(floor, FLOOR_RANGE, FLOOR_SKEW))
}

/**
 * Generate choices based on
 * @param floor
 * @param range
 * @param skew
 * @returns {*[]}
 */
export function generateFloorChoices(floor, range = 1, skew = 0){
  const minVal = Math.floor((floor - 1) / 10) * 10 + 1
  const choices = []
  for(let i = 0; i < range; i++){
    const val = Math.max(minVal, floor - range + i + 1)
    choices.push({ weight: 100 * (1 + skew * i), value: val })
  }
  return choices
}

function getMonsterDefinition(floor, rarity = 1){
  floor = Math.max(1, floor)
  if(rarity === 1){
    return getBasicMonsterDefinition(floor)
  }
  throw 'Non-basic monster not implemented yet'
}

function getBasicMonsterDefinition(floor){
  floor = ((floor - 1) % 100) + 1
  if(!monstersByFloor[floor]){
    throw `Could not find monster for floor ${floor}`
  }
  return {
    level: floor,
    ...monstersByFloor[floor]
  }
}