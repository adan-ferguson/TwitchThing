import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 3 + 7,
    effect: {
      stats: {
        physDef: exponentialPercentage(0.2, level - 1, 0.45),
        magicDef: exponentialPercentage(0.2, level - 1, 0.45),
        speed: -10 + level * -20
      }
    },
    displayName: 'Magic Plate Mail'
  }
}