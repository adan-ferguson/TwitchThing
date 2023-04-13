import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/actionDefs/common/attack.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        initialCooldown: 18000 + 2000 * level,
        actions: [
          attackAction({
            damageMulti: 2.5 + level * 0.5
          })
        ]
      }
    },
    mods: [physScaling]
  }),
  orbs: 3,
  rarity: 1
}