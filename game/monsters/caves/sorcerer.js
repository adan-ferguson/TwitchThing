import { magicAttackMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { stunnedStatusEffect } from '../../statusEffects/combined.js'

export default {
  baseStats: {
    hpMax: '-40%',
    magicPower: '-20%'
  },
  items: [
    {
      name: 'Magic Attack',
      mods: [magicAttackMod]
    },
    {
      name: 'Lightning Bolt',
      abilities: {
        active: {
          cooldown: 10000,
          initialCooldown: 10000,
          actions: [
            attackAction({
              damageMulti: 3,
              damageType: 'magic'
            }),
            statusEffectAction({
              affects: 'enemy',
              base: stunnedStatusEffect,
              effect: {
                duration: 1000
              }
            })
          ]
        }
      }
    }
  ]
}