import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        magicPower: wrappedPct( 10 * level),
        combatXP: wrappedPct(5 + 5 * level)
      }
    },
    orbs: 1 * level
  }
}