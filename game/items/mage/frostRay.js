import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { roundToFixed } from '../../utilFunctions.js'

export default {
  levelFn: level => {
    const damageMulti = 0.9 + level * 0.1
    const slow = 1300 + 200 * level
    return {
      abilities: {
        active: {
          cooldown: 15000,
          description: `Deal [magicAttack${damageMulti}] magic damage and slow the opponent by ${roundToFixed(slow / 1000, 1)}s.`,
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
                  slow
                }
              }
            })
          ]
        }
      },
      mods: [magicScalingMod]
    }
  },
  orbs: 5
}