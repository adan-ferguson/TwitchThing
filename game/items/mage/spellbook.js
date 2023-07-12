import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        magicPower: wrappedPct( 20 * level),
        combatXP: wrappedPct(20 * level)
      }
    },
    orbs: 1 + 2 * level
  }
}