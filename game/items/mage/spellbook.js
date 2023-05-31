import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        combatXP: wrappedPct(geometricProgression(0.2, level, 30, 5))
      }
    },
    orbs: 3 * level
  }
}