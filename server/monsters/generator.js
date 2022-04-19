import scaledValue from '../../game/scaledValue.js'
import { getMonsterDefinition } from './library.js'
import { StatDefinitions, StatType } from '../../game/stats/statDefinitions.js'
import { generateChest } from '../dungeons/chests.js'

const POWER_MULTIPLIER = 0.20
const CHEST_DROP_CHANCE = 0.1
const MONSTER_CHANCE_INCREASE_PER_ROOM = 0.06
const FLOOR_RANGE = 5 // If we're on floor X, we'll get monsters of difficulty X - FLOOR_RANGE + 1 to X

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
  const floor = Math.max(1, Math.ceil(dungeonRun.floor - Math.random() * FLOOR_RANGE))
  const monsterDefinition = getMonsterDefinition(floor)
  const scalingValue = scaledValue(POWER_MULTIPLIER, floor - 1)
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
        rewards.chests = generateChest({ level: floor })
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