import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { dodgeChanceStat, physPowerStat } from '../../stats/combined.js'
import parentEffectAction from '../../actions/parentEffectAction.js'
import { exponentialPercentage, geometricProgession } from '../../exponentialValue.js'

export default {
  levelFn: level => ({
    description: 'Whenever you dodge, refresh this item\'s active ability.',
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
        minor: true,
        actions: [
          parentEffectAction({
            refreshCooldown: true
          })
        ]
      }
    },
    stats: {
      [dodgeChanceStat.name]: exponentialPercentage(0.1, level),
      [physPowerStat.name]: Math.round(geometricProgession(0.4, level, 150))
    },
    mods: [physScaling]
  }),
  orbs: 7
}