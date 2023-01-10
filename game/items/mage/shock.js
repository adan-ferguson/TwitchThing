import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 5000,
        actions: [
          attackAction({
            damageRange: { min: 0.45 + level * 0.05, max: 1.8 + level * 0.2 },
            damageType: 'magic'
          })
        ]
      }
    },
    mods: [magicScalingMod]
  }),
  orbs: 2
}