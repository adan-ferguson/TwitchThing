import { magicAttackMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'

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
              damageMulti: 2.5,
              damageType: 'magic'
            })
          ]
        }
      // name: 'Barrier',
      // abilities: {
      //   active: {
      //     cooldown: 14000,
      //     actions: [
      //       statusEffectAction({
      //         base: barrierStatusEffect,
      //         effect: {
      //           params: {
      //             power: 1.4
      //           }
      //         }
      //       })
      //     ]
      //   }
      }
    }
  ]
}