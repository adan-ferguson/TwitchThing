import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physDef: exponentialPercentage(0.05, level - 1, 0.20),
        speed: 10 + 10 * level
      }
    },
    orbs: 1 + 2 * level
  }
}