import turnTimeAction from '../../actions/turnTimeAction.js'
import { exponentialPercentage } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      dodgeChance: exponentialPercentage(0.05, level - 1, 0.2)
    },
    abilities: {
      dodge: {
        description: 'Whenever you dodge an ability, act immediately.',
        actions: [turnTimeAction({
          setRemaining: 50
        })]
      }
    }
  }),
  orbs: 6,
  rarity: 1
}