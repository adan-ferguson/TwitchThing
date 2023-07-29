import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 2 + 2,
    effect: {
      stats: {
        physPower: wrappedPct(15 + 25 * level),
        magicPower: wrappedPct(15 + 25 * level)
      }
    }
  }
}