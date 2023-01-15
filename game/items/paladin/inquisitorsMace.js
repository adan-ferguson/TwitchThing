import { stunnedStatusEffect } from '../../statusEffects/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  levelFn: level => {
    const chance = 17 + level * 3
    return {
      displayName: 'Inquisitor\'s Mace',
      stats: {
        physPower: `+${30 + level * 10}%`
      },
      abilities: {
        attackHit: {
          description: `After landing an attack, ${chance}% chance to stun for 3 seconds.`,
          chance: chance / 100,
          actions: [
            statusEffectAction({
              base: stunnedStatusEffect,
              affects: 'enemy',
              effect: {
                stacking: 'extend',
                stackingId: 'macestun',
                duration: 3000
              }
            })
          ]
        }
      }
    }
  },
  orbs: 8
}