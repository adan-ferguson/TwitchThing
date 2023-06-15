import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        combatXP: wrappedPct(30 * level)
      }
    },
    orbs: 3 * level
  }
}