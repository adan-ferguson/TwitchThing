import { exponentialPercentage } from '../../exponentialValue.js'
import { critChanceStat, dodgeChanceStat, speedStat } from '../../stats/combined.js'

export default {
  levelFn: level => ({
    stats: {
      [speedStat.name]: 30 * level,
      [dodgeChanceStat.name]: exponentialPercentage(10, level),
      [critChanceStat.name]: exponentialPercentage(10, level)
    }
  }),
  orbs: 6
}