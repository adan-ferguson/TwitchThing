import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 15000,
        actions: [
          attackAction({
            damageMulti: 1.4 + level * 0.1
          })
        ]
      }
    },
    mods: [physScaling]
  }),
  orbs: 1
}