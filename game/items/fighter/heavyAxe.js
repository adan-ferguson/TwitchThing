import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(75 + geometricProgression(0.25, level, 75, 5)),
        speed: -20 - 20 * level
      }
    },
    orbs: 3 * level + 3
  }
}