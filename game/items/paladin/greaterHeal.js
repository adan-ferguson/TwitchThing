import gainHealthAction from '../../actions/gainHealthAction.js'
import removeStatusEffectAction from '../../actions/removeStatusEffectAction.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  levelFn: level => ({
    mods: [magicScalingMod],
    abilities: {
      active: {
        initialCooldown: 40000,
        description: '{A0} Cleanse all debuffs. Only use this when health is below 50%.',
        conditions: {
          hpPctBelow: 0.5
        },
        actions: [
          gainHealthAction({
            scaling: { magicPower: 2.5 + level * 0.5 }
          }),
          removeStatusEffectAction({
            count: 'all'
          })
        ]
      }
    }
  }),
  orbs: 9
}