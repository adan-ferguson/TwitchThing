import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        magicPower: wrappedPct( 20 + geometricProgression(0.10, level-1, 15, 1)),
        physDef: exponentialPercentage(0.05, level - 1, 0.1)
      }
    },
    orbs: level * 2
  }
}