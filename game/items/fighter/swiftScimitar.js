import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { fillArray } from '../../utilFunctions.js'

export default {
  levelFn: level => {
    return {
      abilities: {
        active: {
          cooldown: 9000 + 3000 * level,
          description: `Attack ${3 + level} times for [physAttack0.6] damage.`,
          actions:
            fillArray(() => attackAction({
              damageMulti: 0.5
            }), 3 + level)
        }
      },
      mods: [physScaling]
    }
  },
  orbs: 6
}