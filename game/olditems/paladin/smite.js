import attackAction from '../../actions/actionDefs/common/attack.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  levelFn: level => {
    const damageMulti = 0.65 + 0.05 * level
    return {
      abilities: {
        active: {
          cooldown: 7500 + 500 * level,
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