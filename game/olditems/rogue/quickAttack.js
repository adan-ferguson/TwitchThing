import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/actionDefs/common/attack.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        description: '{A0} Your next turn is 50% faster.',
        cooldown: 10000,
        nextTurnOffset: {
          pct: 0.5
        },
        actions: [
          attackAction({
            damageMulti: 0.65 + level * 0.05
          })
        ]
      }
    },
    mods: [physScaling]
  }),
  orbs: 1
}