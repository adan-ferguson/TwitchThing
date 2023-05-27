import { magicScalingMod } from '../../mods/combined.js'
import attackAction from '../../actions/actionDefs/common/attack.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'

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
          description: 'Deal [magicScaling2] magic damage and reduce speed by 50 for 20s.',
          actions: [
            attackAction({
              damageType: 'magic',
              damageMulti: 2
            }),
            statusEffectAction({
              target: 'enemy',
              effect: {
                stacking: true,
                displayName: 'Iced',
                duration: 20000,
                persisting: true,
                stats: {
                  speed: -50
                }
              }
            })
          ]
        }
      }
    }
  ]
}