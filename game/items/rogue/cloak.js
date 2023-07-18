import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        speed: 10 + 10 * level,
        dodgeChance: exponentialPercentage(0.05, level - 1, 0.1)
      }
    },
    orbs: level * 2 + 2,
    displayName: 'Cloak'
  }
}