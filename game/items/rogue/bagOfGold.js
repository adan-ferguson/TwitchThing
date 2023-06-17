import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        goldFind: wrappedPct(geometricProgression(0.2, level, 30, 5))
      }
    },
    orbs: level * 3
  }
}