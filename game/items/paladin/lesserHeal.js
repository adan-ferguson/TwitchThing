import { magicScalingMod } from '../../mods/combined.js'
import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  levelFn: level => ({
    mods: [magicScalingMod],
    abilities: {
      active: {
        initialCooldown: 15000,
        nextTurnOffset: {
          pct: 0.5
        },
        actions: [
          gainHealthAction({
            magicScaling: 0.85 + level * 0.15
          })
        ]
      }
    }
  }),
  orbs: 3
}