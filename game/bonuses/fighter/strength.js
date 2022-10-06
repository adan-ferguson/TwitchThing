import { scaledValueCumulative } from '../../scaledValue.js'

const SCALING = 0.2
const BASE = 5

export default {
  effect: level => ({
    stats: {
      physPower: Math.ceil(scaledValueCumulative(SCALING, level, BASE))
    }
  }),
  rarity: 0,
  upgradable: true
}