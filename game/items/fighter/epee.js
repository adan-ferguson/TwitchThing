import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { dodgeChanceStat } from '../../stats/combined.js'
import parentEffectAction from '../../actions/parentEffectAction.js'
import { exponentialPercentage } from '../../exponentialValue.js'

export default {
  levelFn: level => ({
    description: 'Whenever you dodge, refresh this item\'s active ability.',
    abilities: {
      active: {
        cooldown: 12000 + level * 6000,
        actions: [
          attackAction({
            damageMulti: 1.4 + level * 0.3
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
      [dodgeChanceStat.name]: exponentialPercentage(0.1, level - 1, 0.2)
    },
    mods: [physScaling]
  }),
  orbs: 8
}