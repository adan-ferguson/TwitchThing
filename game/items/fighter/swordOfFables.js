import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const pow = wrappedPct(50 + geometricProgression(0.2, level, 50, 5))
  const def = exponentialPercentage(0.08, level - 1, 0.3)
  return {
    effect: {
      stats: {
        combatXP: wrappedPct(100 + level * 100),
        speed: 30 + level * 20,
        physPower: pow,
        magicPower: pow,
        physDef: def,
        magicDef: def
      },
      conditions: {
        bossFight: true
      }
    },
    orbs: level * 12
  }
}