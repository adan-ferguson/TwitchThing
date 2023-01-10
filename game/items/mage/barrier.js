import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'

export default {
  levelFn: level => {
    const power = 1.6 + 0.3 * level
    return {
      abilities: {
        active: {
          cooldown: 20000,
          description: `Gain a lingering barrier which absorbs [magicScaling${power}] damage.`,
          actions: [
            statusEffectAction({
              base: barrierStatusEffect,
              effect: {
                lingering: true,
                params: {
                  physPower: power
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