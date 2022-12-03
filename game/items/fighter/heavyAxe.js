import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { geometricProgession } from '../../exponentialValue.js'

const SCALING = 0.4
const BASE = 40

export default {
  levelFn: level => ({
    abilities: {
      active: {
        initialCooldown: 15000 + 5000 * level,
        actions: [
          attackAction({
            damageMulti: 2 + level * 0.25
          })
        ]
      }
    },
    stats: {
      physPower: geometricProgession(SCALING, level, BASE),
      speed: -10 - 20 * level
    },
    mods: [physScaling]
  }),
  orbs: 4
}