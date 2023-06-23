import { bigLoadoutModifier } from '../../commonTemplates/bigLoadoutModifier.js'

export default function(level){
  return {
    orbs: level * 3 - 1,
    effect: {
      stats: {
        block: 0.05 + 0.15 * level
      }
    },
    loadoutModifiers: [bigLoadoutModifier()]
  }
}