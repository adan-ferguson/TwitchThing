import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: -1 + level * 3,
    effect: {
      stats: {
        hpMax: wrappedPct(level * 5),
        physPower: wrappedPct(level * 25)
      }
    }
  }
}