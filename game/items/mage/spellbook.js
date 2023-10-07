import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        magicPower: wrappedPct( 10 + geometricProgression(0.10, level-1, 7, 1)),
        combatXP: wrappedPct(5 + 5 * level)
      }
    },
    orbs: 1 * level
  }
}