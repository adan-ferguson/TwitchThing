import scaledValue from '../../game/scaledValue.js'
import { chooseOne } from '../../game/rando.js'

const POWER_MULTIPLIER = 0.15
const MONSTER_BUFFER = 3 // Minimum rooms between monster encounters
const MONSTER_CHANCE_INCREASE_PER_ROOM = 0.06

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
  const floor = dungeonRun.floor
  const power = scaledValue(POWER_MULTIPLIER, dungeonRun.floor - 1)
  const options = [
    { weight: 10, value: bat },
    { weight: floor >= 5 ? 10 : 0, value: bat },
    { weight: floor >= 10 ? 9 : 0, value: bat },
    { weight: floor >= 15 ? 8 : 0, value: bat },
    { weight: floor >= 20 ? 7 : 0, value: bat },
    { weight: floor >= 25 ? 5 : 0, value: bat }
  ]
  const fn = chooseOne(options)
  return fn(power)
}

function skeleton(power){
  return {
    type: 'monster',
    name: 'Skeleton',
    loadout: [],
    rewards: {
      xp: Math.ceil(power * 20)
    },
    baseStats: {
      hpMax: Math.ceil(24 + 12 * power),
      attack: Math.ceil(4 + 0.5 * power)
    }
  }
}

function bat(power){
  return {
    type: 'monster',
    name: 'Bat',
    loadout: [],
    rewards: {
      xp: Math.ceil(power * 20)
    },
    baseStats: {
      hpMax: Math.ceil(24 + 12 * power),
      attack: Math.ceil(4 + 0.5 * power),
      speed: Math.ceil(40 + 1 * power)
    }
  }
}

function golem(power){
  return {
    type: 'monster',
    name: 'Bat',
    loadout: [],
    rewards: {
      xp: Math.ceil(power * 20)
    },
    baseStats: {
      hpMax: Math.ceil(24 + 12 * power),
      attack: Math.ceil(4 + 0.5 * power),
      speed: Math.ceil(40 + 1 * power)
    }
  }
}