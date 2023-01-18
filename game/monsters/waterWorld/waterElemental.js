import { magicAttackMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'
import attackAction from '../../actions/attackAction.js'
import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  baseStats: {
    magicPower: '-30%',
    hpMax: '-40%',
    speed: 40
  },
  items: [
    {
      name: 'Magic Attack',
      mods: [magicAttackMod]
    },
    {
      name: 'Water Shield',
      abilities: {
        active: {
          initialCooldown: 6000,
          cooldown: 20000,
          description: 'Gain a barrier with [magicScaling3] health. Magic power is doubled while the barrier is up.',
          actions: [
            statusEffectAction({
              base: barrierStatusEffect,
              effect: {
                displayName: 'Water Shield',
                stats: {
                  magicPower: '2x'
                },
                params: {
                  magicPower: 3
                }
              }
            })
          ]
        }
      }
    },
    {
      name: 'Tidal Wave',
      abilities: {
        active: {
          description: 'Deal [magicScaling1] damage, and restore [magicScaling1] health.',
          initialCooldown: 12000,
          cooldown: 20000,
          actions: [
            attackAction({
              damageType: 'magic'
            }),
            gainHealthAction({
              scaling: { magicPower: 1 }
            })
          ]
        }
      }
    }
  ]
}