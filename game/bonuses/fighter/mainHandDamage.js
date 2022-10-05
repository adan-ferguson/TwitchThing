import scaledValue from '../../scaledValue.js'
import { roundToFixed } from '../../utilFunctions.js'

const SCALING = 0.25
const BASE = 1.5

export default {
  effect: level => ({
    stats: {
      mainHandDamage: roundToFixed(scaledValue(SCALING, level - 1, BASE), 2)
    }
  }),
  upgradable: true,
  rarity: 1,
  requires: 'mainHand'
}