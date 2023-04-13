import attackAction from '../../actions/actionDefs/common/attack.js'
import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'
import { poisonedStatusEffect } from '../../statusEffects/combined.js'

export default {
  levelFn: level => {
    const damageMulti = 1 + 0.2 * level
    const burn = damageMulti / 5
    return {
      abilities: {
        active: {
          cooldown: 20000,
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
  orbs: 7,
  rarity: 1
}