import attackAction from '../../actions/attackAction.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const dmg = 0.6 + 0.1 * level
    return {
      stats: {
        blockChance: '25%',
        magicPower: leveledPercentageString(10, 10, level)
      },
      abilities: {
        block: {
          description: `When you block an attack, the attacker takes [magicScaling${dmg}] magic damage.`,
          actions: [
            attackAction({
              damageType: 'magic',
              damageMulti: dmg
            })
          ]
        }
      }
    }
  },
  orbs: 7
}