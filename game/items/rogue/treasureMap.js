import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        chestFind: wrappedPct(level * 0.25)
      }
    },
    orbs: level * 2
  }
}