import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physDef: exponentialPercentage(0.10, level - 1, 0.30),
        hpMax: wrappedPct(10 + geometricProgression(0.2, level, 30, 5)),
        speed: -30 - level * 10
      }
    },
    orbs: 3 + level * 3
  }
}