import { combatXPStat, magicPowerStat } from '../../stats/combined.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [magicPowerStat.name]: leveledPercentageString(15, 5, level),
      [combatXPStat.name]: leveledPercentageString(20, 10, level),
    }
  }),
  orbs: 3
}