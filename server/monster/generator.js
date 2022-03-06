import ScaledValue from '../../game/scaledFactor.js'
import randoJando from '../../game/randoJando.js'

const POWER_MULTIPLIER = 1.3
const MONSTER_BUFFER = 3 // Minimum rooms between monster encounters
const MONSTER_CHANCE_INCREASE_PER_ROOM = 0.05
const powerScaler = new ScaledValue(POWER_MULTIPLIER)

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
  const power = powerScaler.getVal(dungeonRun.floor - 1)
  const options = [
    { weight: 10, fn: bat },
    { weight: floor >= 5 ? 10 : 0, fn: bat },
    { weight: floor >= 10 ? 10 : 0, fn: bat },
    { weight: floor >= 15 ? 10 : 0, fn: bat },
    { weight: floor >= 20 ? 10 : 0, fn: bat },
    { weight: floor >= 25 ? 10 : 0, fn: bat }
  ]
  return randoJando(options, [power])
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