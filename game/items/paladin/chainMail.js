import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 2 + 1,
    effect: {
      stats: {
        physDef: exponentialPercentage(0.1, level - 1, 0.2),
        speed: -20
      }
    },
    displayName: 'Plate Mail'
  }
}