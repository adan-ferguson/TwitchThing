import { exponentialPercentage } from '../../exponentialValue.js'
import { dodgeChanceStat, speedStat } from '../../stats/combined.js'

export default {
  levelFn: level => ({
    stats: {
      [speedStat.name]: 20 + 10 * level,
      [dodgeChanceStat.name]: exponentialPercentage(0.1, level - 1, 0.2)
    }
  }),
  orbs: 5
}