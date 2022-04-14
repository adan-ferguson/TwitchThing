import scaledValue from '../../game/scaledValue.js'
import { getMonsterDefinition } from './library.js'

const POWER_MULTIPLIER = 0.20
const MONSTER_BUFFER = 3 // Minimum rooms between monsters encounters
const MONSTER_CHANCE_INCREASE_PER_ROOM = 0.06
const FLOOR_RANGE = 5 // If we're on floor X, we'll get monsters of difficulty X - FLOOR_RANGE + 1 to X

export function foundMonster(dungeonRun){
  const monsterChance = (-MONSTER_BUFFER + roomsSinceMonster()) * MONSTER_CHANCE_INCREASE_PER_ROOM
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
  const floor = Math.ceil(dungeonRun.floor - Math.random() * FLOOR_RANGE)
  const monsterDefinition = getMonsterDefinition(floor)
  const rewardValue = scaledValue(POWER_MULTIPLIER, floor - 1)
  return {
    items: [],
    ...monsterDefinition,
    rewards: generateRewards(rewardValue)
  }
}

function generateRewards(rewardValue){
  return {
    xp: 25 * rewardValue
  }
}