import { bigLoadoutModifier } from '../../commonMechanics/bigLoadoutModifier.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: (level + 3) + 'x',
        speed: -50 - 50 * level
      }
    },
    orbs: 5 * level + 5,
    loadoutModifiers: [bigLoadoutModifier()]
  }
}