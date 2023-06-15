import { exponentialPercentage, geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const pow = 15 + geometricProgression(0.2, level, 10, 5)
  const def = exponentialPercentage(0.05, level - 1, 0.1)
  return {
    effect: {
      stats: {
        combatXP: wrappedPct(pow * 2),
        speed: level * 10,
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
    orbs: level * 12
  }
}