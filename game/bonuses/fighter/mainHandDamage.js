import { exponentialValue } from '../../exponentialValue.js'
import { roundToFixed } from '../../utilFunctions.js'

const SCALING = 0.25
const BASE = 40

export default {
  effect: level => ({
    stats: {
      mainHandDamage: roundToFixed(exponentialValue(SCALING, level - 1, BASE), 2) + '%'
    }
  }),
  upgradable: true,
  rarity: 1,
  requires: 'mainHand'
}