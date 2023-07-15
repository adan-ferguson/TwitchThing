import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 2 + 2,
    effect: {
      stats: {
        physPower: wrappedPct(20 + 20 * level),
        magicPower: wrappedPct(20 + 20 * level)
      }
    }
  }
}