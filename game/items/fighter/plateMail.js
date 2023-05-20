import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physDef: exponentialPercentage(0.1, level - 1, 0.4),
        hpMax: wrappedPct(40 + geometricProgression(0.2, level, 30, 5)),
        speed: -30 - level * 10
      }
    },
    orbs: 2 + level * 5
  }
}