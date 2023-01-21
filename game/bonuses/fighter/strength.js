import { geometricProgession } from '../../growthFunctions.js'

const SCALING = 0.2
const BASE = 5

export default {
  effect: level => ({
    stats: {
      physPower: Math.ceil(geometricProgession(SCALING, level, BASE))
    }
  })
}