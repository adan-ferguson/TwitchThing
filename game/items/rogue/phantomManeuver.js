import statusEffectAction from '../../actions/statusEffectAction.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const critDamage = leveledPercentageString(25, 25, level)
    return {
      abilities: {
        crit: {
          description: `After dodging, gain [ScritChance1] and [ScritDamage${critDamage}] next turn.`,
          actions: [
            statusEffectAction({
              effect: {
                isBuff: true,
                displayName: 'Phantom Attack',
                turns: 1,
                stats: {
                  critChance: 1,
                  critDamage
                }
              }
            })
          ]
        }
      }
    }
  },
  orbs: 12,
  rarity: 2
}