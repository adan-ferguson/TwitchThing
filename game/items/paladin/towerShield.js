import { bigLoadoutModifier } from '../../commonMechanics/bigLoadoutModifier.js'

export default function(level){
  return {
    orbs: level * 2,
    effect: {
      stats: {
        block: 0.08 + 0.12 * level
      }
    },
    loadoutModifiers: [bigLoadoutModifier()]
  }
}