import { magicDefStat } from '../../stats/combined.js'
import { minMax } from '../../utilFunctions.js'
import { exponentialPercentage } from '../../exponentialValue.js'

export default {
  levelFn: level => {
    const maxDmg = 0.8 + level * 0.2
    return {
      description: `Against enemies with high magic power, deal up to +${maxDmg * 100}% extra damage.`,
      damageDealtModifier: enemy => {
        return 1 + maxDmg * minMax(0, enemy.magicPower / enemy.basePower - 1, 1)
      },
      stats: {
        [magicDefStat.name]: exponentialPercentage(0.2, level - 1, 0.3)
      }
    }
  },
  orbs: 9
}