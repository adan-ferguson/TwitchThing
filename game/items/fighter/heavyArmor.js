import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physDef: exponentialPercentage(0.15, level - 1, 0.4),
      }
    },
    orbs: 6 + level * 2
  }
}