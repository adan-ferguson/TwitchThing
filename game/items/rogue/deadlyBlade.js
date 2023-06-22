import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        critChance: 0.15 + level * 0.05,
        critDamage: wrappedPct(30 + geometricProgression(0.25, level, 20, 5))
      }
    },
    orbs: level * 3 + 4
  }
}