import attackAction from '../../actions/actionDefs/common/attack.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'
import { magicAttackMod } from '../../mods/combined.js'

export default {
  baseStats: {
    magicDef: '40%',
    physPower: '-50%',
    magicPower: '+80%',
    hpMax: '-30%',
    speed: -80
  },
  items: [
    {
      name: 'Magic Attack',
      mods: [magicAttackMod]
    },
    {
      name: 'EVIL Barrier',
      abilities: {
        active: {
          cooldown: 12000,
          description: `Gain a barrier which absorbs [magicScaling${1.5}] damage.`,
          actions: [
            statusEffectAction({
              base: barrierStatusEffect,
              effect: {
                params: {
                  magicPower: 1.5
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
          initialCooldown: 20000,
          actions: [
            attackAction({
              damageType: 'magic',
              damageMulti: 3.5
            })
          ]
        }
      }
    }
  ]
}