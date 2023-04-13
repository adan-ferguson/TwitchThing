import { poisonedStatusEffect } from '../../statusEffects/combined.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'

export default {
  levelFn: level => {
    const damage = 0.17 + 0.03 * level
    return {
      stats: {
        critChance: damage
      },
      abilities: {
        crit: {
          description: `After landing a crit, poison the target for [physScaling${damage}] phys damage per second.`,
          actions: [
            statusEffectAction({
              base: poisonedStatusEffect,
              affects: 'enemy',
              effect: {
                params: {
                  damage,
                  damageType: 'phys'
                }
              }
            })
          ]
        }
      }
    }
  },
  orbs: 4,
  rarity: 1
}