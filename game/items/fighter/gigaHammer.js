import { bigLoadoutModifier } from '../../commonMechanics/bigLoadoutModifier.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: (level * 2 + 2) + 'x',
        speed: -100 * level
      }
    },
    orbs: 5 * level + 5,
    loadoutModifiers: [bigLoadoutModifier()]
  }
}