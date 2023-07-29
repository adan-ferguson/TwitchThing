import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        magicDef: exponentialPercentage(0.3, level - 1, 0.4)
      }
    }
  }
}