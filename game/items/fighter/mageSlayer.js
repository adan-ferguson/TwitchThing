import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { magicDefStat } from '../../stats/combined.js'
import { minMax } from '../../utilFunctions.js'

// TODO: something fun?

export default {
  levelFn: level => {
    const minDmg = 1.5 + level * 0.5
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
        [magicDefStat.name]: 1 - (0.6 * Math.pow(0.9, level - 1))
      },
      mods: [physScaling]
    }
  },
  orbs: 9
}