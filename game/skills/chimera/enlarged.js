import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const val = 10 + geometricProgression(0.25, level, 30, 10)
  return {
    effect: {
      stats: {
        physPower: wrappedPct(val),
        hpMax: wrappedPct(val),
        speed: -(val / 2)
      }
    },
  }
}