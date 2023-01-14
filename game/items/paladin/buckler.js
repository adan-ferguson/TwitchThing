import { physDefStat, blockChanceStat } from '../../stats/combined.js'
import { exponentialPercentage } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [physDefStat.name]: exponentialPercentage(0.05, level - 1, 0.1),
      [blockChanceStat.name]: exponentialPercentage(0.05, level - 1, 0.1)
    }
  }),
  orbs: 1
}