import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { magicDefStat } from '../../stats/combined.js'
import { minMax } from '../../utilFunctions.js'
import { exponentialPercentage } from '../../exponentialValue.js'

export default {
  levelFn: level => {
    const minDmg = 1.7 + level * 0.3
    const maxDmg = minDmg * 2
    return {
      abilities: {
        active: {
          cooldown: 15000,
          description: `Deals [physAttack${minDmg}] to [physAttack${maxDmg}] damage, scales with enemy magic power.`,
          actions: [
            (combat, owner, results) => {
              const enemy = combat.getEnemyOf(owner)
              const pct = minMax(1, enemy.magicPower / enemy.basePower ,2) - 1
              return attackAction({
                damageMulti: minDmg + pct * (maxDmg - minDmg)
              })
            }
          ]
        }
      },
      stats: {
        [magicDefStat.name]: exponentialPercentage(0.2, level - 1, 0.3)
      },
      mods: [physScaling]
    }
  },
  orbs: 9
}