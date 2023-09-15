import { pocketSandAbility } from '../../commonMechanics/pocketSandAbility.js'

export default function(level){
  return {
    effect: {
      abilities: [pocketSandAbility(level)]
    },
    orbs: level * 1 + 1
  }
}