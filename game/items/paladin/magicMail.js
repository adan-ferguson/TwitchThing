import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 3 + 2,
    effect: {
      stats: {
        physDef: exponentialPercentage(0.1, level - 1, 0.20),
        magicDef: exponentialPercentage(0.1, level - 1, 0.20),
        speed: -10 + level * -10
      }
    },
    displayName: 'Exalted Plate Mail'
  }
}