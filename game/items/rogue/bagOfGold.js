import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        chestFind: wrappedPct(25 + 15 * level)
      }
    },
    orbs: level * 1 + 2
  }
}