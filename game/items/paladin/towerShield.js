import { bigLoadoutModifier } from '../../commonTemplates/bigLoadoutModifier.js'

export default function(level){
  return {
    orbs: level * 3 - 1,
    effect: {
      stats: {
        block: 0.08 + 0.12 * level
      }
    },
    loadoutModifiers: [bigLoadoutModifier()]
  }
}