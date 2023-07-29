import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        combatXP: wrappedPct(10 + 20 * level)
      }
    }
  }
}