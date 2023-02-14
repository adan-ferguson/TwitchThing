import statusEffectAction from '../../actions/statusEffectAction.js'
import { exponentialPercentage } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const duration = 8000 + level * 2000
    const dodgeChance = exponentialPercentage(0.2, level - 1, 0.5)
    return {
      abilities: {
        active: {
          description: `Gain [SdodgeChance${dodgeChance}] for ${Math.round(duration / 1000)}.`,
          cooldown: 30000,
          actions: [
            statusEffectAction({
              effect: {
                isBuff: true,
                stacking: 'extend',
                duration,
                stats: {
                  dodgeChance
                }
              },
              affects: 'self'
            })
          ]
        }
      }
    }
  },
  orbs: {
    mage: 2,
    rogue: 5
  },
  rarity: 2
}