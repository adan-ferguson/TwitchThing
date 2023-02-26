import { exponentialPercentage, leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      chestLevel: leveledPctString(15, 5, level),
      critChance: 0.1 + 0.02 * level,
      dodgeChance: exponentialPercentage(0.02, level - 1, 0.1)
    }
  }),
  orbs: 7,
  rarity: 1
}