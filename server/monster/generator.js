export async function generateMonster(floor){
  const power = floor * (floor + 1) / 2
  return {
    type: 'monster',
    name: 'Bat',
    loadout: [],
    rewards: {
      xp: Math.ceil(6 + power * 12)
    },
    baseStats: {
      hpMax: Math.ceil(13 + 4 * power),
      attack: Math.ceil(4 + 1.06 * power),
      speed: Math.ceil(1.2 + 0.04 * power)
    }
  }
}