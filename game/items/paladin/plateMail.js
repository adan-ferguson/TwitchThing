import { exponentialPercentage, leveledPercentageString } from '../../growthFunctions.js'
import { hpMaxStat, physDefStat, speedStat } from '../../stats/combined.js'

export default {
  levelFn: level => {
    return {
      stats: {
        [hpMaxStat.name]: leveledPercentageString(40, 10, level),
        [physDefStat.name]: exponentialPercentage(0.1, level - 1, 0.3),
        [speedStat.name]: -40 - level * 10
      }
    }
  },
  orbs: 5
}