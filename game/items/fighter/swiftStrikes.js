import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { fillArray } from '../../utilFunctions.js'

export default {
  levelFn: level => {
    return {
      abilities: {
        active: {
          cooldown: 8000 + 2000 * level,
          description: `Attack ${2 + level} times for [physAttack0.5] damage.`,
          actions:
            fillArray(() => attackAction({
              damageMulti: 0.5
            }), 2 + level)
        }
      },
      mods: [physScaling]
    }
  },
  orbs: 6
}