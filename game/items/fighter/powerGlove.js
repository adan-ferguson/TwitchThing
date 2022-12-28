import { physPowerStat, speedStat } from '../../stats/combined.js'

export default {
  levelFn: level => ({
    stats: {
      [physPowerStat.name]: `+${20 + level * 10}%`,
      [speedStat.name]: -5 - level * 5
    }
  }),
  orbs: 2
}