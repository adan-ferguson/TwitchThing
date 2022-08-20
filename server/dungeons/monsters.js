import { generateRandomChest } from './chests.js'
import { chooseOne } from '../../game/rando.js'
import { all as Monsters } from '../../game/monsters/combined.js'
import { getMonsterStats, levelToXpReward } from '../../game/monster.js'

const monstersByFloor = {
  // Caves
  1: Monsters.rat,
  2: Monsters.troglodyte,
  3: Monsters.bat,
  4: Monsters.kobold,
  5: Monsters.ooze,
  6: Monsters.spider,
  7: Monsters.scorpion,
  8: Monsters.rockGolem,
  9: Monsters.sorcerer,
  10: Monsters.minotaur,
  // Crypt
  11: Monsters.skeleton,
  12: Monsters.zombie,
  14: Monsters.shade,
  16: Monsters.banshee,
  15: Monsters.necromancer,
  18: Monsters.vampire,
  13: Monsters.deathKnight,
  17: Monsters.lich,
  19: Monsters.abomination,
  20: Monsters.boneDragon,
  // Swamp
  21: Monsters.lizardPerson,
  23: Monsters.gator,
  22: Monsters.toad,
  24: Monsters.naga,
  26: Monsters.biteyPlant,
  25: Monsters.troll,
  27: Monsters.witch,
  28: Monsters.basilisk,
  29: Monsters.thing,
  30: Monsters.hydra,
}

const BONUS_CHESTS_UNTIL = 10
const BONUS_CHEST_CHANCE = 0.45

const CHEST_DROP_CHANCE = 0.08
const MONSTER_CHANCE = 0.4
const MONSTER_ROOM_BUFFER = 2

// Monsters of level [currentFloor - FLOOR_RANGE] to [currentFloor] will spawn (both inclusive).
const FLOOR_RANGE = 4

// How much to skew RNG towards higher levels.
const FLOOR_SKEW = -0.2

export function foundMonster(dungeonRun){
  return roomsSinceMonster() > MONSTER_ROOM_BUFFER && Math.random() < MONSTER_CHANCE
  function roomsSinceMonster(){
    let i
    for(i = 1; i <= dungeonRun.events.length; i++){
      if(dungeonRun.events.at(-i)?.monster){
        break
      }
    }
    return i - 1
  }
}

export async function generateMonster(dungeonRun){

  const level = floorToLevel(dungeonRun.floor, dungeonRun.adventurerInstance.stats.get('combatHarderChance').value)
  const monsterDefinition = getMonsterDefinition(level)

  return {
    ...monsterDefinition,
    level,
    rewards: generateRewards()
  }

  function generateRewards(){
    const advStats = dungeonRun.adventurerInstance.stats
    const monsterStats = getMonsterStats(monsterDefinition)
    const rewardBonus = monsterStats.get('rewards').value
    const rewards = {
      xp: levelToXpReward(level) * advStats.get('combatXP').value * rewardBonus
    }
    if(dungeonRun.user.accomplishments.firstRunFinished){
      // TODO: chest rarity
      const userChests = dungeonRun.user.accomplishments.chestsFound ?? 0
      const dropChance = userChests < BONUS_CHESTS_UNTIL ? BONUS_CHEST_CHANCE : CHEST_DROP_CHANCE
      if(Math.random() < dropChance * advStats.get('chestFind').value){
        rewards.chests = generateRandomChest(dungeonRun, {
          tier: rewardBonus > 1 ? 1 : 0
        })
      }
    }
    return rewards
  }
}

/**
 * Given a floor, return a random level equal to this floor or less, but it has to be
 * the same zone (aka the tens digit must remain the same).
 * @param floor
 * @param harderMonsterChance
 */
function floorToLevel(floor, harderMonsterChance = 1){
  return chooseOne(generateFloorChoices(floor, FLOOR_RANGE, FLOOR_SKEW + harderMonsterChance - 1))
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
    const weight = skew < 0 ? Math.pow(1 + skew, i ) : (1 + skew * i)
    choices.push({ weight: 100 * weight, value: val })
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
    baseStats: {},
    abilities: [],
    ...monstersByFloor[floor]
  }
}