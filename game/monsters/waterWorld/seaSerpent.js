import { magicScalingMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  baseStats: {
    hpMax: '+30%',
    speed: -40
  },
  items: [
    {
      mods: [magicScalingMod],
      name: 'Frost Breath',
      abilities: {
        active: {
          cooldown: 20000,
          description: 'Deal [magicScaling2] magic damage and slow the target for 20s.',
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
                duration: 20000,
                persisting: true,
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