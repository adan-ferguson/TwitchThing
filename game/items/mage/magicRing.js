import { cooldownReductionStat, magicPowerStat } from '../../stats/combined.js'
import { exponentialPercentage, leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [magicPowerStat.name]: leveledPercentageString(50, 10, level),
      [cooldownReductionStat.name]: exponentialPercentage(0.05, level - 1, 0.2)
    }
  }),
  orbs: 8
}