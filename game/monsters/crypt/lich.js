import attackAction from '../../actions/attackAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'

export default {
  baseStats: {
    magicDef: '30%',
    physPower: '-70%',
    magicPower: '+20%',
    hpMax: '-20%'
  },
  items: [
    {
      name: 'Spell Caster',
      description: 'Deals magic damage.',
      mods: ['magicAttack']
    },
    {
      name: 'EVIL Barrier',
      abilities: {
        active: {
          cooldown: 12000,
          actions: [
            statusEffectAction({
              base: barrierStatusEffect,
              effect: {
                params: {
                  power: 1.8
                }
              }
            })
          ]
        }
      }
    },
    {
      name: 'Death Kill Beam',
      abilities: {
        active: {
          initialCooldown: 30000,
          actions: [
            attackAction({
              damageType: 'magic',
              damageMulti: 2.8
            })
          ]
        }
      }
    }
  ]
}