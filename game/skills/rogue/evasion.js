import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        dodgeChance: exponentialPercentage(0.1, level - 1, 0.2),
      }
    }
  }
}