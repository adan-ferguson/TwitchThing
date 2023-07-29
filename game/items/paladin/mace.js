import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 2,
    effect: {
      stats: {
        hpMax: wrappedPct(level * 5),
        physPower: wrappedPct(level * 25)
      }
    }
  }
}