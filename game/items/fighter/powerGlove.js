import { geometricProgession } from '../../exponentialValue.js'

const SCALING = 0.3
const BASE = 12

export default {
  levelFn: level => ({
    stats: {
      physPower: geometricProgession(SCALING, level, BASE)
    }
  }),
  orbs: 2
}