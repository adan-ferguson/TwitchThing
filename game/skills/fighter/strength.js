import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(10 + 15 * level),
        hpMax: wrappedPct(10 + 15 * level)
      }
    }
  }
}