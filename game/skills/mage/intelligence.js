import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        combatXP: wrappedPct(20 + 30 * level)
      }
    }
  }
}