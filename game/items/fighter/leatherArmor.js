import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physDef: exponentialPercentage(0.06, level - 1, 0.10),
        speed: 13 + 7 * level
      }
    },
    orbs: 2 + 2 * level,
    displayName: 'Light Armor'
  }
}