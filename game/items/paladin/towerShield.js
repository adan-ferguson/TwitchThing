import { bigLoadoutModifier } from '../../commonMechanics/bigLoadoutModifier.js'

export default function(level){
  return {
    orbs: level * 1 + 1,
    effect: {
      stats: {
        block: 0.13 + 0.08 * level
      }
    },
    loadoutModifiers: [bigLoadoutModifier()]
  }
}