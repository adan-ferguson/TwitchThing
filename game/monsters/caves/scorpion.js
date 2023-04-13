import { poisonedStatusEffect } from '../../statusEffects/combined.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'
import attackAction from '../../actions/actionDefs/common/attack.js'

const damage = 0.1

export default {
  baseStats: {
    hpMax: '+30%',
    speed: -30,
    physPower: '-10%'
  },
  items: [
    {
      name: 'Tail Sting',
      abilities: {
        active: {
          cooldown: 12000,
          description: `{A0} Poison the opponent for [physScaling${damage}] phys damage per second. Lasts 10s.`,
          actions: [
            attackAction(),
            statusEffectAction({
              base: poisonedStatusEffect,
              affects: 'enemy',
              effect: {
                duration: 10000,
                persisting: true,
                params: {
                  damage,
                  damageType: 'phys'
                }
              }
            })
          ]
        }
      },
    },
  ]
}