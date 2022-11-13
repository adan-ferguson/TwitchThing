import { geometricProgession } from '../../exponentialValue.js'

const SCALING = 0.3
const BASE = 12

export default {
  levelFn: level => ({
    stats: {
      physPower: geometricProgession(SCALING, level, BASE),
      speed: -10 * level
    }
  }),
  orbs: 2
}