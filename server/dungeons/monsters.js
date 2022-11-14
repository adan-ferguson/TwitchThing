import { chooseOne } from '../../game/rando.js'
import { all as Monsters } from '../../game/monsters/combined.js'
import { uuid } from '../../game/utilFunctions.js'
import MonsterInstance from '../../game/monsterInstance.js'
import { generateRandomChest } from './chests.js'

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
  // Forest
  Monsters.woodElf,
  Monsters.boar,
  Monsters.sprite,
  Monsters.badger,
  Monsters.mushroom,
  Monsters.werewolf,
  Monsters.centaur,
  Monsters.druid,
  Monsters.treant,
  Monsters.tyrannosaurus,
  // Crypt
  Monsters.skeleton,
  Monsters.zombie,
  Monsters.ghastlySkull,
  Monsters.assassin,
  Monsters.banshee,
  Monsters.necromancer,
  Monsters.deathKnight,
  Monsters.vampire,
  Monsters.lich,
  Monsters.boneDragon,
  // Swamp
  Monsters.lizardPerson,
  Monsters.wasp,
  Monsters.orc,
  Monsters.biteyPlant,
  Monsters.anaconda,
  Monsters.troll,
  Monsters.basilisk,
  Monsters.witch,
  Monsters.wyvern,
  Monsters.hydra,
  // Water World
  Monsters.legallyDistinctMurloc,
  Monsters.crab,
  Monsters.pirate,
  Monsters.ancientTortoise,
  Monsters.siren,
  Monsters.twoHeadedShark,
  Monsters.mermaidSorceress,
  Monsters.seaSerpent,
  Monsters.waterElemental,
  Monsters.kraken
]

const BONUS_CHESTS_UNTIL = 10
const BONUS_CHEST_CHANCE = 0.45

const CHEST_DROP_CHANCE = 0.05
const BOSS_XP_BONUS = 8

const MONSTER_CHANCE = 0.45
const MONSTER_ROOM_BUFFER = 2

// Monsters of level [currentFloor - FLOOR_RANGE] to [currentFloor] will spawn (both inclusive).
const FLOOR_RANGE = 4

// How much to skew RNG towards higher levels.
const FLOOR_SKEW = -0.2

export function foundMonster(dungeonRun){
  return 1
  // return roomsSinceMonster() > MONSTER_ROOM_BUFFER && Math.random() < MONSTER_CHANCE
  // function roomsSinceMonster(){
  //   let i
  //   for(i = 1; i <= dungeonRun.events.length; i++){
  //     if(dungeonRun.events.at(-i)?.monster){
  //       break
  //     }
  //   }
  //   return i - 1
  // }
}

export async function generateMonster(dungeonRun){

  const level = floorToLevel(dungeonRun.floor)
  const monsterDefinition = getMonsterDefinition(level)

  return {
    ...monsterDefinition,
    level,
    rewards: generateRewards()
  }

  function generateRewards(){
    const monsterInstance = new MonsterInstance(monsterDefinition)
    const advStats = dungeonRun.adventurerInstance.stats
    const rewards = {
      xp: monsterInstance.xpReward * advStats.get('combatXP').value * (monsterInstance.isBoss ? BOSS_XP_BONUS : 1)
    }
    if(dungeonRun.user.accomplishments.firstRunFinished){
      const userChests = dungeonRun.user.accomplishments.chestsFound ?? 0
      const dropChance = userChests < BONUS_CHESTS_UNTIL ? BONUS_CHEST_CHANCE : CHEST_DROP_CHANCE
      if(Math.random() < dropChance || monsterInstance.isBoss){
        rewards.chests = generateRandomChest(dungeonRun, {
          size: monsterInstance.isBoss ? 5 : 1
        })
      }
    }
    return rewards
  }
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

/**
 * @return {[object]}
 */
export function getAllMonsters(){
  return monstersByFloor.slice(1).map((_, floor) => getBasicMonsterDefinition(floor + 1))
}

/**
 * Given a floor, return a random level equal to this floor or less, but it has to be
 * the same zone (aka the tens digit must remain the same).
 * @param floor
 */
function floorToLevel(floor){
  return chooseOne(generateFloorChoices(floor, FLOOR_RANGE, FLOOR_SKEW - 1))
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
    _id: 'basic-' + uuid(),
    baseType: monstersByFloor[floor].name,
    level: floor
  }
}