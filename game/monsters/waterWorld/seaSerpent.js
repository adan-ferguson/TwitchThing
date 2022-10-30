import { magicScalingMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { stunnedStatusEffect } from '../../statusEffects/combined.js'

export default {
  baseStats: {},
  items: [
    {
      mods: [magicScalingMod],
      name: 'Frost Breath',
      abilities: {
        active: {
          cooldown: 20000,
          description: 'Deal [M2] magic damage and freeze the target for 5 seconds.',
          actions: [
            attackAction({
              damageType: 'magic',
              damageMulti: 2
            }),
            statusEffectAction({
              base: stunnedStatusEffect,
              affects: 'enemy',
              effect: {
                displayName: 'Frozen',
                duration: 5000
              }
            })
          ]
        }
      }
    }
  ]
}