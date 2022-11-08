import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 15000,
        actions: [
          attackAction({
            damageMulti: 1.3 + level * 0.2
          })
        ]
      }
    }
  }),
  orbs: 3,
  mods: [physScaling]
}