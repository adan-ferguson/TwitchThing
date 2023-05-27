import { magicScalingMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'
import { poisonedStatusEffect } from '../../statusEffects/combined.js'

const damage = 0.02

export default {
  baseStats: {
    hpMax: '-50%',
    physPower: '-50%',
    speed: 150
  },
  items: [{
    name: 'Toxic Sting',
    mods: [magicScalingMod],
    abilities: {
      attackHit: {
        chance: 0.2,
        description: `Attacks have a 20% chance to inflict poison. [physScaling${damage}] phys damage per second. Lasts 30s.`,
        actions: [
          statusEffectAction({
            base: poisonedStatusEffect,
            target: 'enemy',
            effect: {
              persisting: true,
              duration: 30000,
              params: {
                damage,
                damageType: 'phys'
              }
            }
          })
        ]
      }
    }
  }]
}