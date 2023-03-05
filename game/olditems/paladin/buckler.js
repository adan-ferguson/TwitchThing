import { exponentialPercentage, leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      hpMax: leveledPctString(3, 2, level),
      blockChance: exponentialPercentage(0.03, level - 1, 0.1)
    }
  }),
  orbs: 1
}