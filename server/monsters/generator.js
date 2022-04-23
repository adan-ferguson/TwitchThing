import scaledValue from '../../game/scaledValue.js'
import { getMonsterDefinition } from './library.js'
import { StatDefinitions, StatType } from '../../game/stats/statDefinitions.js'
import { generateRandomChest } from '../dungeons/chests.js'
import { chooseOne } from '../../game/rando.js'

const POWER_MULTIPLIER = 0.30
const CHEST_DROP_CHANCE = 0.1
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
  const scalingValue = scaledValue(POWER_MULTIPLIER, level - 1)
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
  const base = Math.floor((floor - 1) / 10)
  const minVal = Math.max(base + 1, floor - 5)
  const maxVal = floor - base
  const choices = generateFloorChoices(minVal, maxVal, FLOOR_RANGE, FLOOR_SKEW)
  return chooseOne(choices)
}

/**
 * Generate choices based on
 * @param minVal
 * @param maxVal
 * @param range
 * @param skew
 * @returns {*[]}
 */
export function generateFloorChoices(minVal, maxVal, range, skew){
  const choices = []
  for(let i = 0; i < range; i++){
    const val = Math.max(minVal, maxVal - range + i + 1)
    choices.push({ weight: 100 * (1 + skew * i), value: val })
  }
  return choices
}