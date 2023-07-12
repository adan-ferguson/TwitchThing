import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const pow = 20 + geometricProgression(0.2, level, 20, 5)
  const def = exponentialPercentage(0.05, level - 1, 0.1)
  return {
    effect: {
      stats: {
        speed: level * 10 + 10,
        physPower: wrappedPct(pow),
        magicPower: wrappedPct(pow),
        physDef: def,
        magicDef: def
      },
      metaEffects: [{
        metaEffectId: 'swordOfFablesMultiplier',
        subject: {
          key: 'self'
        },
        conditions: {
          owner: {
            bossFight: true
          }
        },
        effectModification: {
          statMultiplier: 2 + level,
        }
      }]
    },
    orbs: level * 8 + 4
  }
}