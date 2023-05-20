import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      conditions: {
        deepestFloor: true
      },
      stats: {
        combatXP: wrappedPct(50 * level),
      }
    }
  }
}