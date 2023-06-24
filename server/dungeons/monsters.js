import { chooseOne } from '../../game/rando.js'
import Monsters from '../../game/monsters/combined.js'
import { uniqueID } from '../../game/utilFunctions.js'
import MonsterInstance from '../../game/monsterInstance.js'
import { generateMonsterChest, generateRandomChest } from './chests.js'
import { addRewards } from './results.js'
import { unlockedClasses } from '../../game/user.js'

const monstersByFloor = [
  null,
  // Caves
  Monsters.rat,
  Monsters.bat,
  Monsters.bandit,
  Monsters.spider,
  Monsters.kobold,
  Monsters.ooze,
  Monsters.scorpion,
  Monsters.sorcerer,
  Monsters.rockGolem,
  Monsters.minotaur,
  // // Forest
  Monsters.woodElf,
  Monsters.sprite,
  Monsters.badger,
  Monsters.mushroom,
  Monsters.boar,
  Monsters.werewolf,
  Monsters.centaur,
  Monsters.druid,
  Monsters.treant,
  Monsters.tyrannosaurus,
  // // Crypt
  Monsters.skeleton,
  Monsters.zombie,
  Monsters.ghastlySkull,
  Monsters.assassin,
  Monsters.banshee,
  Monsters.necromancer,
  Monsters.vampire,
  Monsters.deathKnight,
  Monsters.lich,
  Monsters.boneDragon,
  // // Swamp
  Monsters.lizardPerson,
  Monsters.wasp,
  Monsters.gator,
  Monsters.orc,
  Monsters.basilisk,
  Monsters.biteyPlant,
  Monsters.troll,
  Monsters.witch,
  Monsters.wyvern,
  Monsters.hydra,
  // // Water World
  Monsters.legallyDistinctMurloc,
  Monsters.crab,
  Monsters.pirate,
  Monsters.ancientTortoise,
  Monsters.siren,
  // Monsters.twoHeadedShark,
  // Monsters.stormMermaid,
  // Monsters.seaSerpent,
  // Monsters.waterElemental,
  // Monsters.kraken
]

const PITY_THRESHOLD = 0.75

const BONUS_CHESTS_UNTIL = 12
const BONUS_CHEST_CHANCE = 0.15

const CHEST_DROP_CHANCE = 0.025
const CHEST_DROP_CHANCE_HARD_ENEMY = 0.09 // It's an enemy of level >= adventurer's deepest floor

const BOSS_XP_BONUS = 10

// Monsters of level [currentFloor - FLOOR_RANGE] to [currentFloor] will spawn (both inclusive).
const FLOOR_RANGE = 4

// How much to skew RNG towards higher levels.
const FLOOR_SKEW = -0.12

export function foundMonster(dungeonRun){
  return 1
}

export function generateSuperMonster(dungeonRun){
  const monsterDefinition = getMonsterDefinition((dungeonRun.room - 1) % 50)
  monsterDefinition.level = dungeonRun.room + 54
  return {
    ...monsterDefinition,
    super: true,
    rewards: generateRewards(dungeonRun, monsterDefinition)
  }
}

export async function generateMonster(dungeonRun, boss){

  const index = boss ? dungeonRun.floor : floorToLevel(dungeonRun.floor)
  const monsterDefinition = getMonsterDefinition(index)
  monsterDefinition.level = index
  monsterDefinition.boss = boss

  return {
    ...monsterDefinition,
    rewards: generateRewards(dungeonRun, monsterDefinition)
  }
}

function generateRewards(dungeonRun, monsterDefinition){
  const monsterInstance = new MonsterInstance(monsterDefinition)
  const advStats = dungeonRun.adventurerInstance.stats
  const level = monsterInstance.level
  const rewards = {
    xp: monsterInstance.xpReward * advStats.get('combatXP').value * (monsterInstance.isBoss ? BOSS_XP_BONUS : 1)
  }
  if(dungeonRun.user.accomplishments.firstRunFinished){
    const userChests = dungeonRun.user.accomplishments.chestsFound ?? 0
    const hardEnemy = level >= dungeonRun.adventurer.accomplishments.deepestFloor
    const dropMulti = dungeonRun.adventurerInstance.stats.get('chestFind').value
    const dropChance = (userChests < BONUS_CHESTS_UNTIL ? BONUS_CHEST_CHANCE :
      hardEnemy ? CHEST_DROP_CHANCE_HARD_ENEMY : CHEST_DROP_CHANCE) * dropMulti
    const dropChest =
      Math.random() < dropChance ||
      monsterInstance.isBoss ||
      dropPityChest(dungeonRun, dropChance)

    if(dropChest){
      rewards.chests = generateMonsterChest(dungeonRun, monsterInstance)
      rewards.pityPoints = -1
    }else{
      rewards.pityPoints = dropChance
    }
  }
  return addRewards(rewards, monsterInstance.rewards)
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
    if(val % 10 === 0){
      continue
    }
    const weight = skew < 0 ? Math.pow(1 + skew, i ) : (1 + skew * i)
    choices.push({ weight: 100 * weight, value: val })
  }
  return choices
}

/**
 * @return {[object]}
 */
export function getAllMonsters(){
  return monstersByFloor.slice(1).map((_, floor) => {
    const def = getBasicMonsterDefinition(floor + 1)
    if((floor + 1) % 10 === 0){
      def.boss = true
    }
    return def
  })
}

/**
 * Given a floor, return a random level equal to this floor or less, but it has to be
 * the same zone (aka the tens digit must remain the same).
 * @param floor
 */
function floorToLevel(floor){
  return chooseOne(generateFloorChoices(floor, FLOOR_RANGE, FLOOR_SKEW))
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
    _id: 'basic-' + uniqueID(),
    baseType: monstersByFloor[floor].id,
    level: floor
  }
}

function dropPityChest(dungeonRun, dropChance){
  if((dungeonRun.rewards.pityPoints ?? 0) + dropChance > PITY_THRESHOLD){
    return true
  }
  return false
}