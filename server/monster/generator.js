export async function generateMonster(floor){
  return {
    type: 'monster',
    name: 'Bat',
    loadout: [],
    rewards: {
      xp: floor * 50
    },
    baseStats: {
      hpMax: 20 + 10 * floor,
      attack: 4 + 1 * floor,
      speed: 1.2 + 0.1 * floor
    }
  }
}