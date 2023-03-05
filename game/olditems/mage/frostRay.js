import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  levelFn: level => {
    const damageMulti = 0.9 + level * 0.1
    const slow = 40 + 10 * level
    return {
      abilities: {
        active: {
          cooldown: 15000,
          description: `Deal [magicAttack${damageMulti}] magic damage and reduce the opponent's speed by ${slow}.`,
          actions: [
            attackAction({
              damageMulti,
              damageScaling: 'magic'
            }),
            statusEffectAction({
              affects: 'enemy',
              effect: {
                stacking: true,
                displayName: 'Iced',
                stats: {
                  speed: -slow
                }
              }
            })
          ]
        }
      },
      mods: [magicScalingMod]
    }
  },
  orbs: 5,
  rarity: 1
}