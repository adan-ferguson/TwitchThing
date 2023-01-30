import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  levelFn: level => {
    const damageMulti = 0.63 + 0.07 * level
    return {
      abilities: {
        active: {
          cooldown: 7000 + 1000 * level,
          actions: [
            [attackAction({
              damageType: 'phys',
              damageMulti
            })],
            [attackAction({
              damageType: 'magic',
              damageMulti
            })]
          ]
        }
      },
      mods: [magicScalingMod]
    }
  },
  orbs: 2
}