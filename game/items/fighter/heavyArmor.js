import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physDef: '40%',
        hpMax: wrappedPct(geometricProgression(0.2, level, 40, 5)),
        speed: -30 - level * 10
      }
    },
    orbs: 3 + level * 4
  }
}