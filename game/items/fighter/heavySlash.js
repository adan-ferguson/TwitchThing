import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        initialCooldown: 18000 + 2000 * level,
        actions: [
          attackAction({
            damageMulti: 2.7 + level * 0.3
          })
        ]
      }
    },
    mods: [physScaling]
  }),
  orbs: 3
}