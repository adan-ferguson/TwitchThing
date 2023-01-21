import statusEffectAction from '../../actions/statusEffectAction.js'
import { speedStat } from '../../stats/combined.js'

export default {
  levelFn: level => {
    const speed = 15 + level * 5
    return {
      stats: {
        startingFood: level
      },
      abilities: {
        rest: {
          description: `After resting, gain [Sspeed${speed}] for 15 seconds.`,
          actions: [
            statusEffectAction({
              effect: {
                isBuff: true,
                displayName: 'Caffeine Rush',
                persisting: true,
                stacking: 'extend',
                duration: 15000,
                stats: {
                  [speedStat.name]: speed
                }
              }
            })
          ]
        }
      }
    }
  },
  orbs: 3
}