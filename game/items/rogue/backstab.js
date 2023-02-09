import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'

export default {
  levelFn: level => {
    const extraDamage = 0.8 + 0.2 * level
    return {
      abilities: {
        active: {
          description: `{A0} This attack benefits from [ScritDamage+${extraDamage * 100}%].`,
          cooldown: 10000 + level * 2000,
          actions: [
            attackAction({
              damageMulti: 1.3,
              extraCritDamage: extraDamage
            })
          ]
        }
      },
      mods: [physScaling]
    }
  },
  orbs: 3
}