import { poisonedStatusEffect } from '../../statusEffects/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  baseStats: {
    hpMax: '+30%',
    speed: -50
  },
  items: [
    {
      name: 'Tail Sting',
      mods: [magicScalingMod],
      abilities: {
        active: {
          cooldown: 12000,
          actions: [
            attackAction(),
            statusEffectAction({
              base: poisonedStatusEffect,
              affects: 'enemy',
              effect: {
                // combatOnly: false
              }
            })
          ]
        }
      },
    },
  ]
}