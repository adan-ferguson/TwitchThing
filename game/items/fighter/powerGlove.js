import { physPowerStat, speedStat } from '../../stats/combined.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [physPowerStat.name]: leveledPercentageString(20, 15, level),
      [speedStat.name]: -5 - level * 5
    }
  }),
  orbs: 2
}