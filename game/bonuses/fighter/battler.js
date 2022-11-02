import { exponentialValueCumulative } from '../../exponentialValue.js'
import { roundToNearestIntervalOf } from '../../utilFunctions.js'

const SCALING = 0.2
const BASE = 20

export default {
  effect: level => ({
    stats: {
      combatXP: roundToNearestIntervalOf(exponentialValueCumulative(SCALING, level, BASE), 5) + '%'
    }
  }),
  rarity: 1
}