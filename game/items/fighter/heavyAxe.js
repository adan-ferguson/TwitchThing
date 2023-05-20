import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(50 + geometricProgression(0.2, level, 50, 5)),
        speed: -25 - 25 * level
      }
    },
    orbs: 3 * level + 1
  }
}