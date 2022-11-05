import { roundToFixed } from '../../utilFunctions.js'

export default {
  effect: level => {
    return {
      stats: {
        mainHandCooldownReduction: 100 * (1 - roundToFixed(Math.pow(0.85, level), 2)) + '%'
      }
    }
  },
  requires: 'signatureWeapon',
  minOrbs: 20
}