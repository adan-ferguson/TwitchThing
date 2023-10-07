import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        hpMax: wrappedPct(40 + geometricProgression(0.2, level-1, 20, 5))
      }
    },
  }
}