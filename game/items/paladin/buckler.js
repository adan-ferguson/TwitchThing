import { exponentialPercentage, leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      hpMax: leveledPercentageString(10, 5, level - 1),
      blockChance: exponentialPercentage(0.04, level - 1, 0.1)
    }
  }),
  orbs: 1
}