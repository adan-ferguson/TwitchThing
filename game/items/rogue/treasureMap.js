import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        chestFind: wrappedPct(geometricProgression(0.2, level, 25, 5))
      }
    },
    orbs: level * 2
  }
}