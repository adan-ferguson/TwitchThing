import { magicAttackMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import maybeAction from '../../actions/maybeAction.js'
import attackAction from '../../actions/attackAction.js'
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
            chance: 1/4
          }),
          attackAction({
            damageType: 'magic',
            damageMulti: 0.5
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
    magicPower: '+10%',
    speed: 30,
    hpMax: '-30%'
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
          actions: [
            statusEffectAction(lightningStorm)
          ]
        }
      }
    }
  ]
}