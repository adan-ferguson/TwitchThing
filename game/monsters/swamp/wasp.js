import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { poisonedStatusEffect } from '../../statusEffects/combined.js'

export default {
  baseStats: {
    hpMax: '-40%',
    physPower: '-40%',
    speed: 70
  },
  items: [{
    name: 'Toxic Sting',
    mods: [magicScalingMod],
    abilities: {
      attackHit: {
        chance: 0.2,
        description: 'Attacks have a chance to inflict a persisting poison.',
        actions: [
          statusEffectAction({
            base: poisonedStatusEffect,
            affects: 'enemy',
            effect: {
              persisting: true,
              duration: 30000
            }
          })
        ]
      }
    }
  }]
}