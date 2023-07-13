import { exponentialPercentage } from '../../growthFunctions.js'
import { spikedShellAbility } from '../../commonMechanics/spikedShellAbility.js'

export default function(level){
  return {
    effect: {
      stats: {
        magicDef: exponentialPercentage(0.12, level - 1, 0.3)
      },
      abilities: [spikedShellAbility(0.15 + 0.15 * level, 'magic')]
    },
    orbs: 4 + level * 3,
  }
}