import { generateRandomChest } from './chests.js'
import { chooseOne } from '../../game/rando.js'
import { all as Monsters } from '../../game/monsters/combined.js'
import { uuid } from '../../game/utilFunctions.js'
import MonsterInstance, { levelToXpReward } from '../../game/monsterInstance.js'

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
  Monsters.shade,
  Monsters.banshee,
  Monsters.necromancer,
  Monsters.vampire,
  Monsters.deathKnight,
  Monsters.lich,
  Monsters.abomination,
  Monsters.boneDragon,
  // Swamp
  Monsters.lizardPerson,
  Monsters.toad,
  Monsters.gator,
  Monsters.naga,
  Monsters.biteyPlant,
  Monsters.troll,
  Monsters.witch,
  Monsters.basilisk,
  Monsters.thing,
  Monsters.hydra
]

const BONUS_CHESTS_UNTIL = 10
const BONUS_CHEST_CHANCE = 0.45

const CHEST_DROP_CHANCE = 0.08
const MONSTER_CHANCE = 0.45
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
    const monsterInstance = new MonsterInstance(monsterDefinition)
    const advStats = dungeonRun.adventurerInstance.stats
    const rewardBonus = monsterInstance.stats.get('rewards').value
    const rewards = {
      xp: levelToXpReward(level) * advStats.get('combatXP').value * rewardBonus * 50
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
 * @param harderMonsterChance
 */
function floorToLevel(floor, harderMonsterChance = 1){
  return chooseOne(generateFloorChoices(floor, FLOOR_RANGE, FLOOR_SKEW + harderMonsterChance - 1))
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