import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 2 + 1,
    effect: {
      stats: {
        physDef: exponentialPercentage(0.15, level - 1, 0.4),
        speed: -10 - level * 10
      }
    },
    displayName: 'Plate Mail'
  }
}