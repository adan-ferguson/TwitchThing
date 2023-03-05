import dealDamageAction from '../../actions/dealDamageAction.js'
import { exponentialPercentage, leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const dmg = 0.6 + 0.1 * level
    return {
      stats: {
        blockChance: exponentialPercentage(0.08, level - 1, 0.2),
        magicPower: leveledPctString(15, 5, level)
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
  orbs: 10,
  rarity: 2
}