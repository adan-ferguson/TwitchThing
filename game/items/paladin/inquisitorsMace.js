import { stunnedStatusEffect } from '../../statusEffects/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const chance = 20
    return {
      displayName: 'Inquisitor\'s Mace',
      stats: {
        physPower: leveledPercentageString(25, 15, level)
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