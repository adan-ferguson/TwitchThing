import { cooldownReductionStat, magicPowerStat } from '../../stats/combined.js'
import { exponentialPercentage, leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [magicPowerStat.name]: leveledPercentageString(45, 15, level),
      [cooldownReductionStat.name]: exponentialPercentage(0.1, level - 1, 0.15)
    }
  }),
  orbs: 8
}