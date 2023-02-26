import { combatXPStat, magicPowerStat } from '../../stats/combined.js'
import { leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [magicPowerStat.name]: leveledPctString(20, 5, level),
      [combatXPStat.name]: leveledPctString(20, 5, level),
    }
  }),
  orbs: 3
}