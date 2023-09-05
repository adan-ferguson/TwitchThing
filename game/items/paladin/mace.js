import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    orbs: level * 2,
    effect: {
      stats: {
        hpMax: wrappedPct(geometricProgression(0.10, level, 5, 5)),
        physPower: wrappedPct(geometricProgression(0.10, level, 20, 5))
      }
    }
  }
}