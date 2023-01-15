import { magicScalingMod } from '../../mods/combined.js'
import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  levelFn: level => ({
    mods: [magicScalingMod],
    abilities: {
      active: {
        initialCooldown: 20000,
        description: '{A0} Your next turn is 50% faster.',
        nextTurnOffset: {
          pct: 0.5
        },
        actions: [
          gainHealthAction({
            magicPower: 0.6 + level * 0.1
          })
        ]
      }
    }
  }),
  orbs: 3
}