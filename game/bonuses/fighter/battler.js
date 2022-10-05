import { scaledValueCumulative } from '../../scaledValue.js'
import { roundToNearestIntervalOf } from '../../utilFunctions.js'

const SCALING = 0.2
const BASE = 1.2

export default {
  effect: level => ({
    stats: {
      combatXP: roundToNearestIntervalOf(scaledValueCumulative(SCALING, level - 1, BASE), 0.05)
    }
  }),
  upgradable: true,
  rarity: 0
}