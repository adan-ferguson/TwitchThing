import { freezeActionBarMod, magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  levelFn: level => ({
    slotRestriction: 7,
    description: 'Can only be equipped in slot 8.',
    abilities: {
      active: {
        cooldown: 60000,
        actions: [
          statusEffectAction({
            affects: 'enemy',
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
  orbs: 10
}