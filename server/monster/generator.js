export async function generateMonster(floor){
  const power = floorToPower(floor)
  return {
    type: 'monster',
    name: 'Bat',
    loadout: [],
    rewards: {
      xp: Math.ceil(6 + power * 12)
    },
    baseStats: {
      hpMax: Math.ceil(24 + 12 * power),
      attack: Math.ceil(4 + 1.06 * power),
      speed: Math.ceil(1.2 + 0.04 * power)
    }
  }
}

function floorToPower(floor){
  let base = 1
  for(let i = 0; i < floor; i++){
    base *= 1.5
  }
  return base
}