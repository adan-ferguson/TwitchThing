import ScaledValue from '../../game/scaledFactor.js'

const POWER_MULTIPLIER = 1.3
const powerScaler = new ScaledValue(POWER_MULTIPLIER)

export function foundMonster(dungeonRun){
  const monsterChance = (-3 + roomsSinceMonster()) / 20
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
  const power = powerScaler.getVal(dungeonRun.floor - 1)
  return {
    type: 'monster',
    name: 'Bat',
    loadout: [],
    rewards: {
      xp: Math.ceil(power * 12)
    },
    baseStats: {
      hpMax: Math.ceil(24 + 12 * power),
      attack: Math.ceil(4 + 1.06 * power),
      speed: Math.ceil(1.2 + 0.04 * power)
    }
  }
}