import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(50 + geometricProgression(0.25, level, 50, 5)),
        speed: -20 - 20 * level
      }
    },
    orbs: 2 * level + 1
  }
}