import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        leisurelyPaceMultiplier: wrappedPct(10 + 30 * level),
      }
    }
  }
}