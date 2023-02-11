import { poisonedStatusEffect } from '../../statusEffects/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  levelFn: level => {
    const damage = 0.17 + 0.03
    return {
      stats: {
        critChance: 0.17 + 0.03
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