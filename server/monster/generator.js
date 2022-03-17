import scaledValue from '../../game/scaledValue.js'
import { chooseOne } from '../../game/rando.js'

const POWER_MULTIPLIER = 0.20
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
    { weight: 10, value: skeleton },
    { weight: floor >= 5 ? 9 : 0, value: bat },
    { weight: floor >= 15 ? 8 : 0, value: golem },
    { weight: floor >= 30 ? 7 : 0, value: vampire },
    { weight: floor >= 50 ? 5 : 0, value: dragon }
  ]
  const fn = chooseOne(options)
  const monsterDef = fn(power)
  monsterDef.baseStats.power = power
  return monsterDef
}

function skeleton(power){
  return {
    type: 'monster',
    name: 'Skeleton',
    loadout: [],
    rewards: {
      xp: Math.ceil(power * 40)
    },
    baseStats: {
      hpMax: Math.ceil(40 * power),
      attack: Math.ceil(8 * power)
    }
  }
}

function bat(power){
  return {
    type: 'monster',
    name: 'Bat',
    loadout: [],
    rewards: {
      xp: Math.ceil(power * 50)
    },
    baseStats: {
      hpMax: Math.ceil(25 * power),
      attack: Math.ceil(5 * power),
      speed: 1.5 + 0.05 * power
    }
  }
}

function golem(power){
  return {
    type: 'monster',
    name: 'Iron Golem',
    loadout: [],
    rewards: {
      xp: Math.ceil(power * 70)
    },
    baseStats: {
      hpMax: Math.ceil(50 * power),
      attack: Math.ceil(16 * power),
      speed: 0.5,
      physDef: defFlatToPct(20 + 1.5 * power),
    }
  }
}

function vampire(power){
  return {
    type: 'monster',
    name: 'Vampire',
    loadout: [],
    rewards: {
      xp: Math.ceil(power * 100)
    },
    baseStats: {
      hpMax: Math.ceil(40 * power),
      attack: Math.ceil(12 * power),
      lifesteal: 25
    }
  }
}

function dragon(power){
  return {
    type: 'monster',
    name: 'Dragon',
    loadout: [],
    rewards: {
      xp: Math.ceil(power * 200)
    },
    baseStats: {
      hpMax: Math.ceil(50 * power),
      attack: Math.ceil(14 * power),
      physDef: defFlatToPct(10 + 0.8 * power),
      speed: 1.1 + 0.02 * power
    }
  }
}

function defFlatToPct(flat){
  return (flat / (100 + flat)).toFixed(1)
}