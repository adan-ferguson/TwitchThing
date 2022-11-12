import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { geometricProgession } from '../../exponentialValue.js'

const SCALING = 0.25
const BASE = 8

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
    stats: {
      physPower: geometricProgession(SCALING, level - 1, BASE)
    },
    mods: [physScaling]
  }),
  orbs: 1
}