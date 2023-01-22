import { combatXPStat, magicPowerStat } from '../../stats/combined.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [magicPowerStat.name]: leveledPercentageString(20, 5, level),
      [combatXPStat.name]: leveledPercentageString(20, 5, level),
    }
  }),
  orbs: 3
}