import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      chestValue: leveledPercentageString(15, 5, level),
      critChance: 0.1 + 0.02 * level,
      dodgeChance: 0.1 + 0.02 * level
    }
  }),
  orbs: 7,
  rarity: 1
}