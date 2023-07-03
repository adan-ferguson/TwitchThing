import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physDef: exponentialPercentage(0.07, level - 1, 0.10),
        speed: 5 + 10 * level
      }
    },
    orbs: 2 + 2 * level,
    displayName: 'Light Armor'
  }
}