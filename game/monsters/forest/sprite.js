import statusEffectAction from '../../actions/statusEffectAction.js'
import { dodgingStatusEffect } from '../../statusEffects/combined.js'
import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  baseStats: {
    speed: '+50%',
    hpMax: '-50%',
    physPower: '-40%'
  },
  items: [
    {
      name: 'Fluttering',
      abilities: {
        beforeAttacked: {
          cooldown: 10000,
          name: 'dodgeOne',
          actions: [
            statusEffectAction({
              base: dodgingStatusEffect,
              effect: {
                duration: 0
              }
            })
          ]
        }
      }
    },
    {
      name: 'Magic Blast',
      abilities: {
        active: {
          cooldown: 10000,
          actions: [
            attackAction({
              damageType: 'magic'
            })
          ]
        }
      },
      mods: [magicScalingMod]
    }
  ]
}