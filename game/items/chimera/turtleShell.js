import { spikedShellAbility } from '../../commonMechanics/spikedShellAbility.js'

export default function(level){
  return {
    effect: {
      abilities: [spikedShellAbility(0.06 + 0.06 * level)]
    },
    orbs: 2 + level * 2,
    displayName: 'Spiked Shell'
  }
}