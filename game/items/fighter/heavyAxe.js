import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        initialCooldown: 20000,
        actions: [
          attackAction({
            damageMulti: 2
          })
        ]
      }
    },
    stats: {
      physPower: `+${20 + 30 * level}%`,
      speed: -10 - 15 * level
    },
    mods: [physScaling]
  }),
  orbs: 4
}