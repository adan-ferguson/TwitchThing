import { exponentialPercentage, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      effectId: 'sneakPast',
      stats: {
        sneakChance: exponentialPercentage(0.05, level - 1, 0.2),
        sneakXP: wrappedPct(25 * level)
      }
    }
  }
}