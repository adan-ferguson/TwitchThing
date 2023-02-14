import { leveledPctString } from '../../growthFunctions.js'
import dealDamageAction from '../../actions/dealDamageAction.js'

export default {
  levelFn: level => {
    const scaling = 0.7 + 0.1 * level
    return {
      abilities: {
        physAttackHit: {
          description: `Your phys attacks deal an extra [magicScaling${0}] to [magicScaling${scaling}] magic damage.`,
          actions: [
            dealDamageAction({
              damageType: 'magic',
              scaling: {
                magicPower: scaling
              },
              range: [0, 1]
            })
          ]
        }
      },
      stats: {
        magicPower: leveledPctString(35, 5, level),
        physPower: leveledPctString(35, 5, level)
      }
    }
  },
  orbs: {
    fighter: 5,
    mage: 7
  },
  rarity: 2
}