import { freezeActionBarMod, freezeCooldownsMod, magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 45000,
        description: `Stop time for the opponent for ${8 + level * 2}s.`,
        actions: [
          statusEffectAction({
            targets: 'enemy',
            effect: {
              displayName: 'Stopped',
              duration: 8000 + level * 2000,
              mods: [freezeActionBarMod, freezeCooldownsMod]
            }
          })
        ]
      }
    },
    mods: [magicScalingMod]
  }),
  orbs: 9,
  rarity: 2
}