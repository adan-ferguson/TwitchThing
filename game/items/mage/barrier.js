import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 20000,
        actions: [
          statusEffectAction({
            base: barrierStatusEffect,
            effect: {
              params: {
                power: 1.6 + 0.3 * level
              }
            }
          })
        ]
      }
    },
    mods: [magicScalingMod]
  }),
  orbs: 4
}