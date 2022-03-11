import scaledValue from '../../game/scaledValue.js'
import { chooseOne } from '../../game/rando.js'

const POWER_MULTIPLIER = 0.15
const MONSTER_BUFFER = 3 // Minimum rooms between monster encounters
const MONSTER_CHANCE_INCREASE_PER_ROOM = 0.05

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
  debugger
  const floor = dungeonRun.floor
  const power = scaledValue(POWER_MULTIPLIER, dungeonRun.floor - 1)
  const options = [
    { weight: 10, fn: bat },
    { weight: floor >= 5 ? 10 : 0, fn: bat },
    { weight: floor >= 10 ? 10 : 0, fn: bat },
    { weight: floor >= 15 ? 10 : 0, fn: bat },
    { weight: floor >= 20 ? 10 : 0, fn: bat },
    { weight: floor >= 25 ? 10 : 0, fn: bat }
  ]
  const fn = chooseOne(options)
  return fn(power)
}

function bat(power){
  return {
    type: 'monster',
    name: 'Bat',
    loadout: [],
    rewards: {
      xp: Math.ceil(power * 12)
    },
    baseStats: {
      hpMax: Math.ceil(24 + 12 * power),
      attack: Math.ceil(4 + 0.5 * power),
      speed: Math.ceil(1.2 + 0.02 * power)
    }
  }
}