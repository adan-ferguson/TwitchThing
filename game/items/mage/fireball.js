import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { poisonedStatusEffect } from '../../statusEffects/combined.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 15000 + level * 5000,
        actions: [
          attackAction({
            damageMulti: 1.2 + 0.2 * level,
            damageScaling: 'magic'
          }),
          statusEffectAction({
            base: poisonedStatusEffect,
            affects: 'enemy',
            effect: {
              displayName: 'Burned',
              params: {
                damage: 0.18 + 0.04 * level
              }
            }
          })
        ]
      }
    },
    mods: [magicScalingMod]
  }),
  orbs: 9
}