import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(5 * level),
        critChance: 0.08 + level * 0.02
      }
    },
    orbs: level * 1
  }
}