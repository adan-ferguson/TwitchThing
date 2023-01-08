import { cooldownReductionStat, magicPowerStat } from '../../stats/combined.js'
import { exponentialPercentage, leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [magicPowerStat.name]: leveledPercentageString(40, 10, level),
      [cooldownReductionStat.name]: exponentialPercentage(0.1, level - 1, 0.25)
    }
  }),
  orbs: 7
}