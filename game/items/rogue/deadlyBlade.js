import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        critChance: 0.05 + level * 0.05,
        critDamage: wrappedPct(20 + geometricProgression(0.25, level, 20, 5))
      }
    },
    orbs: level * 3 + 3
  }
}