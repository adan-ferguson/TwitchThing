import { spikedShellAbility } from '../../commonTemplates/spikedShellAbility.js'

export default function(level){
  return {
    effect: {
      abilities: [spikedShellAbility(0.12)]
    },
    orbs: 2 + level * 2,
    displayName: 'Spiked Shell'
  }
}