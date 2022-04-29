import scaledValue from '../../game/scaledValue.js'
import { getMonsterDefinition } from './library.js'
import { StatDefinitions, StatType } from '../../game/stats/statDefinitions.js'
import { generateRandomChest } from '../dungeons/chests.js'
import { chooseOne } from '../../game/rando.js'

const POWER_MULTIPLIER = 0.25
const ZONE_RAMP_UP_BONUS = 0.1
const CHEST_DROP_CHANCE = 0.05
const MONSTER_CHANCE_INCREASE_PER_ROOM = 0.06

// Monsters of level [currentFloor - FLOOR_RANGE] to [currentFloor] will spawn (both inclusive).
const FLOOR_RANGE = 4

// How much to skew RNG towards higher levels.
const FLOOR_SKEW = 0.1

export function foundMonster(dungeonRun){
  const monsterChance = roomsSinceMonster() * MONSTER_CHANCE_INCREASE_PER_ROOM
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
  const scalingValue = getScalingValue(level - 1)

  monsterDefinition.baseStats = scaleUpStats(monsterDefinition.unscaledStats, scalingValue)
  return {
    items: [],
    ...monsterDefinition,
    rewards: generateRewards()
  }

  function generateRewards(){
    const rewards = {
      xp: 50 * scalingValue
    }
    if(dungeonRun.user.features.items){
      if(Math.random() < CHEST_DROP_CHANCE){
        rewards.chests = generateRandomChest(dungeonRun)
      }
    }
    return rewards
  }
}

function scaleUpStats(unscaledStats, scalingValue){
  const scaledStats = {}
  Object.keys(unscaledStats).forEach(statName => {
    const def = StatDefinitions[statName]
    let val = unscaledStats[statName] * (def.scaling ? scalingValue : 1)
    if(def.type === StatType.COMPOSITE){
      val = Math.round(val)
    }
    scaledStats[statName] = val
  })
  return scaledStats
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

function getScalingValue(level){
  return scaledValue(POWER_MULTIPLIER, iterations(level))
}

export function iterations(level){
  const zones = Math.floor(level / 10)
  const floors = level % 10
  return floors * (1 + zones * ZONE_RAMP_UP_BONUS) + zones * (8 + 4 * ZONE_RAMP_UP_BONUS * (zones - 1))
}