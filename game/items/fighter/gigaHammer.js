import { bigLoadoutModifier } from '../../commonTemplates/bigLoadoutModifier.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: (level + 3) + 'x',
        speed: -75 - 25 * level
      }
    },
    orbs: 4 * level + 4,
    loadoutModifiers: [bigLoadoutModifier()]
  }
}