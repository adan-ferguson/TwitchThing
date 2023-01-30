import { leveledPercentageString } from '../../growthFunctions.js'
import dealDamageAction from '../../actions/dealDamageAction.js'

export default {
  levelFn: level => {
    const dmg = 0.45 + 0.05 * level
    return {
      stats: {
        blockChance: '20%',
        magicPower: leveledPercentageString(20, 10, level)
      },
      abilities: {
        block: {
          description: `When you block an attack, the attacker takes [magicScaling${dmg}] magic damage.`,
          actions: [
            dealDamageAction({
              damageType: 'magic',
              scaling: {
                magicPower: dmg
              }
            })
          ]
        }
      }
    }
  },
  orbs: 7
}