import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        speed: 15 * level,
        dodgeChance: exponentialPercentage(0.04, level - 1, 0.1)
      }
    },
    orbs: level * 2 + 2,
    displayName: 'Cloak'
  }
}