import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        speed: 20 * level,
        dodgeChance: exponentialPercentage(0.05, level - 1, 0.05)
      }
    },
    orbs: level * 3 + 1
  }
}