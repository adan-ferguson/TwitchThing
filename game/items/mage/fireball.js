import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { poisonedStatusEffect } from '../../statusEffects/combined.js'

export default {
  levelFn: level => {
    const damageMulti = 1.2 + 0.2 * level
    const burn = 0.18 + 0.04 * level
    return {
      abilities: {
        active: {
          cooldown: 15000 + level * 5000,
          description: `{A0} Burn the opponent for [magicScaling${burn}] magic damage per second.`,
          actions: [
            attackAction({
              damageMulti,
              damageType: 'magic'
            }),
            statusEffectAction({
              base: poisonedStatusEffect,
              affects: 'enemy',
              effect: {
                displayName: 'Burned',
                params: {
                  damage: burn
                }
              }
            })
          ]
        }
      },
      mods: [magicScalingMod]
    }
  },
  orbs: 9
}