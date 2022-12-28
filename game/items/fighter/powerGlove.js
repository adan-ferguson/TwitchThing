import { physPowerStat } from '../../stats/combined.js'

export default {
  levelFn: level => ({
    stats: {
      [physPowerStat.name]: `+${10 + level * 10}%`
    }
  }),
  orbs: 2
}