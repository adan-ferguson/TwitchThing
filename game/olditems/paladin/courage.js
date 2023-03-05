import statusEffectAction from '../../actions/statusEffectAction.js'
import { leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const amount = leveledPctString(18, 2, level)
    return {
      abilities: {
        attacked: {
          description: `After attacked, gain [SphysPower${amount}] and [SmagicPower${amount}] for rest of combat.`,
          actions: [
            statusEffectAction({
              effect: {
                isBuff: true,
                displayName: 'Courage',
                stacking: true,
                stats: {
                  magicPower: amount + '%',
                  physPower: amount + '%'
                }
              }
            })
          ]
        }
      }
    }
  },
  orbs: 8,
  rarity: 1
}