import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        magicPower: wrappedPct(20 + geometricProgression(0.2, level, 30, 5))
      }
    },
  }
}