import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(24 + geometricProgression(0.10, level-1, 12, 1)),
        hpMax: wrappedPct(24 + geometricProgression(0.10, level-1, 12, 1))
      }
    }
  }
}