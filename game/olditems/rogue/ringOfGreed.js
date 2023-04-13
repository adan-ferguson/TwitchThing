import { leveledPctString } from '../../growthFunctions.js'
import takeDamageAction from '../../actions/actionDefs/common/takeDamageAction.js'

export default {
  levelFn: level => {
    const damagePct = 2 + level * 2
    return {
      stats: {
        chestLevel: leveledPctString(50, 50, level)
      },
      abilities: {
        tick: {
          cooldown: 5000,
          description: `Periodically take ${damagePct}% of max health as magic damage.`,
          actions: [
            takeDamageAction({
              scaling: {
                hpMax: damagePct / 100
              },
              damageType: 'magic'
            })
          ]
        }
      }
    }
  },
  orbs: 0,
  rarity: 2
}