import { spikedShellAbility } from '../../commonMechanics/spikedShellAbility.js'
import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      abilities: [spikedShellAbility(0.10 + 0.05 * level)]
    },
    stats: {
      physDef: exponentialPercentage(0.07, level - 1, 0.10),
    },
    orbs: 3 + level * 1,
    displayName: 'Spiked Shell'
  }
}