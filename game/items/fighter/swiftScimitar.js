import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { fillArray } from '../../utilFunctions.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 12000,
        actions: [
          fillArray(() => attackAction({
            damageMulti: 0.6
          }), 2 + level)
        ]
      }
    },
    stats: {
      speed: 10 * level
    },
    mods: [physScaling]
  }),
  orbs: 5
}