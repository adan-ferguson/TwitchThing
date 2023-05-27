import { stunnedStatusEffect } from '../../statusEffects/combined.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'
import { leveledPctString } from '../../growthFunctions.js'
import { roundToFixed } from '../../utilFunctions.js'

export default {
  levelFn: level => {
    const duration = 1900 + level * 100
    return {
      displayName: 'Inquisitor\'s Mace',
      stats: {
        physPower: leveledPctString(30, 10, level)
      },
      abilities: {
        attackHit: {
          description: `After landing an attack, 20% chance to stun for ${roundToFixed(duration / 1000, 1)} seconds.`,
          chance: 0.2,
          actions: [
            statusEffectAction({
              base: stunnedStatusEffect,
              target: 'enemy',
              effect: {
                stacking: 'extend',
                stackingId: 'macestun',
                duration
              }
            })
          ]
        }
      }
    }
  },
  orbs: 6,
  rarity: 1
}