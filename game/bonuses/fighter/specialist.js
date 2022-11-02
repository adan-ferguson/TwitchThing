import { exponentialValue } from '../../exponentialValue.js'
import { roundToFixed } from '../../utilFunctions.js'
import { signatureWeaponBonus } from '../combined.js'

export default {
  effect: level => ({
    stats: {
      mainHandCooldownReduction: 1 - roundToFixed(exponentialValue(0.8, level, 1), 2)
    }
  }),
  requires: signatureWeaponBonus.name,
  minOrbs: 20
}