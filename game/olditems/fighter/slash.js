import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/actionDefs/common/attack.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 12000,
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