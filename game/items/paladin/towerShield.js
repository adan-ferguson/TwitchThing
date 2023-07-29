import { bigLoadoutModifier } from '../../commonMechanics/bigLoadoutModifier.js'

export default function(level){
  return {
    orbs: level * 1 + 1,
    effect: {
      stats: {
        block: 0.14 + 0.06 * level
      }
    },
    loadoutModifiers: [bigLoadoutModifier()]
  }
}