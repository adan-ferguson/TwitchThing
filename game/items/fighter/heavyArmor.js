import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physDef: exponentialPercentage(0.15, level - 1, 0.35),
        speed: -15 - level * 10
      }
    },
    orbs: 4 + level * 2
  }
}