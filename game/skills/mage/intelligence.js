import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        magicPower: wrappedPct(10 + 15 * level),
        combatXP: wrappedPct(10 + 15 * level)
      }
    }
  }
}