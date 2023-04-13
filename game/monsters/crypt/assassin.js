import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'
import { disarmedStatusEffect } from '../../statusEffects/combined.js'

export default {
  baseStats: {
    hpMax: '-30%',
    physPower: '-30%',
    speed: -10
  },
  items: [
    {
      name: 'Disarm',
      stats: {
        critChance: 0.2
      },
      abilities: {
        crit: {
          description: 'After crit, disarm the opponent\'s slot 1 item for 10 seconds.',
          actions: [
            statusEffectAction({
              base: disarmedStatusEffect,
              affects: 'enemy',
              effect: {
                duration: 10000,
                params: {
                  slot: 0 //'opposing'
                }
              }
            })
          ]
        }
      }
    },
    {
      name: 'Vanish',
      abilities: {
        active: {
          initialCooldown: 10000,
          cooldown: 15000,
          description: 'Disappear for 1 turn, then land a guaranteed crit on the next attack.',
          actions: [
            statusEffectAction({
              effect: {
                displayName: 'Vanished',
                turns: 1,
                stats: {
                  dodgeChance: '100%',
                  critChance: '100%'
                }
              }
            })
          ]
        }
      }
    }
  ]
}