import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        hpMax: wrappedPct(10 + 30 * level)
      }
    },
  }
}