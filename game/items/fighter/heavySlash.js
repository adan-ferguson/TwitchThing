import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        initialCooldown: 15000 + 5000 * level,
        actions: [
          attackAction({
            damageMulti: 2.5 + level * 0.5
          })
        ]
      }
    },
    mods: [physScaling]
  }),
  orbs: 4
}