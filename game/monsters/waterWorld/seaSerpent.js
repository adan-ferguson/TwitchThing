import { magicScalingMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  baseStats: {},
  items: [
    {
      mods: [magicScalingMod],
      name: 'Frost Breath',
      abilities: {
        active: {
          cooldown: 20000,
          description: 'Deal [magicScaling2] magic damage and slow the target.',
          actions: [
            attackAction({
              damageType: 'magic',
              damageMulti: 2
            }),
            statusEffectAction({
              affects: 'enemy',
              effect: {
                stacking: true,
                displayName: 'Iced',
                stats: {
                  slow: 2000
                }
              }
            })
          ]
        }
      }
    }
  ]
}