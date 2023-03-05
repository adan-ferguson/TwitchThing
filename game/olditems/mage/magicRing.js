import { cooldownReductionStat, magicPowerStat } from '../../stats/combined.js'
import { exponentialPercentage, leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [magicPowerStat.name]: leveledPctString(80, 20, level),
      [cooldownReductionStat.name]: exponentialPercentage(0.08, level - 1, 0.25)
    }
  }),
  orbs: 11,
  rarity: 2
}