import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'
import { speedStat } from '../../stats/combined.js'

export default {
  levelFn: level => {
    const speed = 22 + level * 3
    return {
      stats: {
        startingFood: level
      },
      abilities: {
        rest: {
          description: `After resting, gain [Sspeed${speed}] for 20 seconds.`,
          actions: [
            statusEffectAction({
              effect: {
                isBuff: true,
                displayName: 'Caffeine Rush',
                persisting: true,
                stacking: 'extend',
                duration: 20000,
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
  orbs: 4
}