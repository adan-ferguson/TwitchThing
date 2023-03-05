import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'

export default {
  levelFn: level => {
    const power = 1.6 + 0.1 * level
    return {
      abilities: {
        active: {
          cooldown: 20000,
          description: `Gain a persisting barrier which absorbs [magicScaling${power}] damage.`,
          actions: [
            statusEffectAction({
              base: barrierStatusEffect,
              effect: {
                persisting: true,
                params: {
                  magicPower: power
                }
              }
            })
          ]
        }
      },
      mods: [magicScalingMod]
    }
  },
  orbs: 4
}