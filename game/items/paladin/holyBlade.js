import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 4,
    effect: {
      stats: {
        physPower: wrappedPct(40 * level),
        magicPower: wrappedPct(40 * level)
      }
    }
  }
}