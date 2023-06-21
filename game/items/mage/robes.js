import { exponentialPercentage, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        magicPower: wrappedPct( 20 * level),
        physDef: exponentialPercentage(0.07, level - 1, 0.1)
      }
    },
    orbs: level * 2
  }
}