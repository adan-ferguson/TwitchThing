import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 4 + 3,
    effect: {
      stats: {
        hpMax: wrappedPct(geometricProgression(0.2, level, 20, 5)),
        physDef: exponentialPercentage(0.1, level - 1, 0.3),
        magicDef: exponentialPercentage(0.1, level - 1, 0.3),
        speed: -10 + level * -10
      }
    },
    displayName: 'Magic Plate Mail'
  }
}