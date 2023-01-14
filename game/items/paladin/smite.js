import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  levelFn: level => {
    const damageMulti = 0.65 + 0.05 * level
    return {
      abilities: {
        active: {
          cooldown: 8000,
          actions: [
            attackAction({
              damageType: 'phys',
              damageMulti
            }),
            attackAction({
              damageType: 'magic',
              damageMulti
            })
          ]
        }
      },
      mods: [magicScalingMod]
    }
  },
  orbs: 2
}