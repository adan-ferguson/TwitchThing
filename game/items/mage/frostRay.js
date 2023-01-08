import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 12000 + level * 3000,
        actions: [
          attackAction({
            damageMulti: 0.9 + level * 0.1,
            damageScaling: 'magic'
          }),
          statusEffectAction({
            affects: 'enemy',
            effect: {
              stacking: true,
              displayName: 'Iced',
              stats: {
                slow: 1500 + 500 * level
              }
            }
          })
        ]
      }
    },
    mods: [magicScalingMod]
  }),
  orbs: 5
}