import { leveledPercentageString } from '../../growthFunctions.js'
import takeDamageAction from '../../actions/takeDamageAction.js'

export default {
  levelFn: level => {
    const damagePct = 2 + level * 4
    return {
      stats: {
        chestValue: leveledPercentageString(50, 50, level)
      },
      abilities: {
        tick: {
          initialCooldown: 5000,
          description: `Periodically take ${damagePct}% of remaining health as magic damage.`,
          actions: [
            takeDamageAction({
              scaling: {
                hp: damagePct / 100
              }
            })
          ]
        }
      }
    }
  },
  orbs: 0,
  rarity: 2
}