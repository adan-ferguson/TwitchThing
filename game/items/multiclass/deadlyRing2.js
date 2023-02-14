import { leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    return {
      stats: {
        physPower: leveledPctString(30, 10, level),
        critChance: 0.20 + 0.05 * level,
        critDamage: leveledPctString(30, 10, level)
      }
    }
  },
  orbs: {
    fighter: 4,
    rogue: 6
  },
  rarity: 2
}