import physScaling from '../../mods/generic/physScaling.js'
import { critChanceStat } from '../../stats/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import damageSelfAction from '../../actions/damageSelfAction.js'
import { exponentialPercentage } from '../../exponentialValue.js'
import { roundToNearestIntervalOf } from '../../utilFunctions.js'

export default {
  levelFn: level => {
    const duration = roundToNearestIntervalOf(30 * (Math.pow(0.8, level - 1)), 0.1)
    return {
      abilities: {
        crit: {
          description: `Whenever you crit, the target bleeds for that much as physical damage over ${duration} seconds.`,
          actions: [
            ({ triggerData }) => {
              const damageJustDealt = triggerData.damageResultData.totalDamage
              const damage = Math.ceil(damageJustDealt / duration)
              return statusEffectAction({
                affects: 'enemy',
                effect: {
                  displayName: 'Bleeding',
                  duration: duration * 1000,
                  abilities: {
                    tick: {
                      initialCooldown: 1000,
                      actions: [
                        damageSelfAction({
                          damageType: 'phys',
                          damage,
                          ignoreDefense: true
                        })
                      ]
                    }
                  }
                }
              })
            }
          ]
        }
      },
      stats: {
        [critChanceStat.name]: 0.2 + level * 0.1
      },
      mods: [physScaling]
    }
  },
  orbs: 10
}