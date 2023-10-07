import { bigLoadoutModifier } from '../../commonMechanics/bigLoadoutModifier.js'

export default function(level){
  return {
    orbs: level * 1 + 1,
    effect: {
      stats: {
        block: 0.15 + 0.1 * level
      }
    },
    loadoutModifiers: [bigLoadoutModifier()]
  }
}