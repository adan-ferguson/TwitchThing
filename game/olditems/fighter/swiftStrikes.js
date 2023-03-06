import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { fillArray } from '../../utilFunctions.js'

export default {
  levelFn: level => {
    return {
      abilities: {
        active: {
          cooldown: 9000 + level * 1000,
          description: `Attack ${3 + level} times for [physAttack0.5] damage.`,
          actions:
            fillArray(() => [attackAction({
              damageMulti: 0.5
            })], 3 + level)
        }
      },
      mods: [physScaling]
    }
  },
  orbs: 6,
  rarity: 1
}