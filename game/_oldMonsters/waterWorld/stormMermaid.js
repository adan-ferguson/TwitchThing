import { magicAttackMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'
import maybeAction from '../../actions/actionDefs/common/maybeAction.js'
import attackAction from '../../actions/actionDefs/common/attack.js'
import { stunnedStatusEffect } from '../../statusEffects/combined.js'

const lightningStorm = {
  effect: {
    displayName: 'Lightning Storm',
    duration: 10000,
    abilities: {
      tick: {
        cooldown: 1000,
        actions: [
          maybeAction({
            chance: 1/3
          }),
          attackAction({
            damageType: 'magic',
            damageMulti: 0.7
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
}

export default {
  baseStats: {
    magicPower: '+40%',
    speed: -10,
    hpMax: '-20%'
  },
  items: [
    {
      name: 'Magic Attack',
      mods: [magicAttackMod]
    },
    {
      name: 'Lightning Storm',
      abilities: {
        active: {
          cooldown: 20000,
          description: 'Shoot a bunch of lightning I don\'t feel like explaining.',
          actions: [
            statusEffectAction(lightningStorm)
          ]
        }
      }
    }
  ]
}