import attackAction from '../../actions/actionDefs/common/attack.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 5000,
        actions: [
          attackAction({
            damageMulti: 2.25 + level * 0.25,
            range: [0, 1],
            damageType: 'magic'
          })
        ]
      }
    },
    mods: [magicScalingMod]
  }),
  orbs: 2
}