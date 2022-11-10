import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { geometricProgession } from '../../exponentialValue.js'

const SCALING = 0.35
const BASE = 20

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 15000 + 5000 * level,
        initialCooldown: '50%',
        actions: [
          attackAction({
            damageMulti: 2 + level * 0.25
          })
        ]
      }
    },
    stats: {
      physPower: geometricProgession(SCALING, level, BASE),
      speed: -10 - 10 * level
    }
  }),
  orbs: 4,
  mods: [physScaling]
}