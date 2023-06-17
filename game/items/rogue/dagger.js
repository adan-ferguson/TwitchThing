import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(5 + 5 * level),
        critChance: 0.025 + level * 0.025
      }
    },
    orbs: level * 1
  }
}