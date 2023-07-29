import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        critChance: (1 / (level + 1)) + 'x',
        critDamage: wrappedPct(level * 200)
      }
    }
  }
}