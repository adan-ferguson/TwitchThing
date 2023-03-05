import attackAction from '../../actions/attackAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { stunnedStatusEffect } from '../../statusEffects/combined.js'

export default {
  levelFn: level => {
    const scaling = 1.1 + level * 0.2
    const stun = 1.7 + level * 0.3
    return {
      abilities: {
        dodge: {
          description: `After dodging, retaliate for [physAttack${scaling}]. If it crits, stun for ${stun}s.`,
          actions: [
            attackAction({
              damageMulti: scaling
            }),
            ({ results }) => {
              const crit = results[0]?.data?.crit
              if(crit){
                return statusEffectAction({
                  affects: 'enemy',
                  base: stunnedStatusEffect,
                  effect: {
                    duration: stun * 1000
                  }
                })
              }
            }
          ]
        }
      }
    }
  },
  orbs: 12,
  rarity: 2
}