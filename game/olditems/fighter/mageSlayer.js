import { minMax } from '../../utilFunctions.js'
import { exponentialPercentage, leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const maxDmg = 0.75 + level * 0.25
    return {
      description: `Attacks deal extra damage to enemies with high magic power, up to +${Math.round(maxDmg * 100)}%.`,
      damageDealtModifier: enemy => {
        const factor = 3 * (enemy.magicPower / enemy.basePower - 1)
        return 1 + minMax(0, factor, maxDmg)
      },
      stats: {
        magicDef: exponentialPercentage(0.1, level - 1, 0.5),
        physPower: leveledPctString(40, 10, level)
      }
    }
  },
  orbs: 10,
  rarity: 2
}