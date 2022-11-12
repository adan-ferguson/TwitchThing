import { exponentialPercentage } from '../../exponentialValue.js'
import { dodgeChanceStat, speedStat } from '../../stats/combined.js'

export default {
  levelFn: level => ({
    stats: {
      [speedStat.name]: 30 * level,
      [dodgeChanceStat.name]: exponentialPercentage(0.15, level)
    }
  }),
  orbs: 6
}