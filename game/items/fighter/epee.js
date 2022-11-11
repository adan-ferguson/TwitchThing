import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { dodgeChanceStat, physPowerStat, speedStat } from '../../stats/combined.js'
import parentEffectAction from '../../actions/parentEffectAction.js'
import { exponentialPercentage, geometricProgession } from '../../exponentialValue.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 18000,
        actions: [
          attackAction({
            damageMulti: 1.7 + 0.4 * level
          })
        ]
      },
      dodge: {
        actions: [
          parentEffectAction({
            refreshCooldown: true
          })
        ]
      }
    },
    stats: {
      [dodgeChanceStat.name]: exponentialPercentage(10, level),
      [physPowerStat.name]: Math.round(geometricProgession(0.4, level, 150))
    },
    mods: [physScaling]
  }),
  orbs: 7
}