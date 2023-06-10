import { exponentialPercentage, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 3 + 3,
    effect: {
      stats: {
        physDef: exponentialPercentage(0.1, level - 1, 0.30),
        magicDef: exponentialPercentage(0.1, level - 1, 0.30),
        magicPower: wrappedPct(30 * level),
        speed: -20 + level * -10
      }
    },
    displayName: 'Exalted Mail'
  }
}