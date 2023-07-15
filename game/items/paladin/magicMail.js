import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 4 + 3,
    effect: {
      stats: {
        physDef: exponentialPercentage(0.15, level - 1, 0.4),
        magicDef: exponentialPercentage(0.15, level - 1, 0.4),
        speed: -10 + level * -20
      }
    },
    displayName: 'Magic Plate Mail'
  }
}