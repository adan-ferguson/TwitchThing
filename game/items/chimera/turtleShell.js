import { spikedShellAbility } from '../../commonMechanics/spikedShellAbility.js'

export default function(level){
  return {
    effect: {
      abilities: [spikedShellAbility(0.15 + 0.05 * level)]
    },
    orbs: 3 + level * 1,
    displayName: 'Spiked Shell'
  }
}