import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        hpMax: wrappedPct(20 + geometricProgression(0.10, level-1, 15, 1)),
      }
    },
    orbs: level * 1,
    displayName: 'Bulk'
  }
}