import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const pow = wrappedPct(15 + geometricProgression(0.2, level, 10, 5))
  const def = exponentialPercentage(0.05, level - 1, 0.1)
  return {
    effect: {
      stats: {
        combatXP: wrappedPct(25 + level * 25),
        speed: 5 + level * 5,
        physPower: pow,
        magicPower: pow,
        physDef: def,
        magicDef: def
      },
      exclusiveMods: [{
        bossFightStatMultiplier: 4
      }]
    },
    orbs: level * 12
  }
}