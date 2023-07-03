import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physDef: exponentialPercentage(0.15, level - 1, 0.30),
        speed: -10 - level * 10
      }
    },
    orbs: 3 + level * 2
  }
}