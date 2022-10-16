import { magicAttackMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'

export default {
  baseStats: {
    hpMax: '-40%',
    magicPower: '+10%'
  },
  items: [
    {
      name: 'Magic Attack',
      mods: [magicAttackMod]
    },
    {
      name: 'Barrier',
      abilities: {
        active: {
          cooldown: 1400,
          actions: [
            statusEffectAction({
              base: barrierStatusEffect,
              params: {
                power: 1.4
              }
            })
          ]
        }
      }
    }
  ]
}