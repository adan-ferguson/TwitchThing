import { exponentialPercentage } from '../../growthFunctions.js'
import { cooldownReductionStat } from '../../stats/combined.js'

export default {
  effect: level => {
    return {
      slotEffect: {
        slotTag: 'signatureWeapon',
        stats: {
          [cooldownReductionStat.name]: exponentialPercentage('15%', level)
        }
      }
    }
  },
  requires: 'signatureWeapon',
  minOrbs: 20
}