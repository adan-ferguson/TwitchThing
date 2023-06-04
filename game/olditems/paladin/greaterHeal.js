import gainHealthAction from '../../actions/actionDefs/common/gainHealthAction.js'
import removeStatusEffectAction from '../../actions/actionDefs/common/removeStatusEffectAction.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  levelFn: level => ({
    mods: [magicScalingMod],
    abilities: {
      active: {
        initialCooldown: 40000,
        description: '{A0} Cleanse all debuffs. Only use this when health is below 50%.',
        conditions: {
          owner: {
            hpPctBelow: 0.5
          }
        },
        actions: [
          gainHealthAction({
            scaling: { magicPower: 2.3 + level * 0.2 }
          }),
          removeStatusEffectAction({
            count: 'all'
          })
        ]
      }
    }
  }),
  orbs: 7,
  rarity: 1
}