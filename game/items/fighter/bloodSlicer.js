import physScaling from '../../mods/generic/physScaling.js'
import attackAction from '../../actions/attackAction.js'
import { geometricProgession } from '../../exponentialValue.js'
import { critChanceStat, critDamageStat } from '../../stats/combined.js'
import { roundToNearestIntervalOf } from '../../utilFunctions.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { takeDamage } from '../../../server/actionsAndTicks/common.js'

export default {
  levelFn: level => {
    const damageMulti = 1.5 + level * 0.5
    return {
      abilities: {
        active: {
          cooldown: 20000,
          description: '{A0} If it crits, the target bleeds for the same amount over 10 seconds.',
          actions: [
            attackAction({
              damageMulti
            },
            (combat, owner, results) => {
              debugger
              return statusEffectAction({
                affects: 'enemy',
                effect: {
                  displayName: 'Bleeding',
                  duration: 10000,
                  abilities: {
                    tick: {
                      initialCooldown: 1000,
                      actions: [
                        takeDamage({
                          damageType: 'phys',
                          damage: results[0].damageOrSomething
                        })
                      ]
                    }
                  }
                }
              })
            })
          ]
        }
      },
      stats: {
        [critChanceStat.name]: 0.15 + level * 0.05,
        [critDamageStat.name]: roundToNearestIntervalOf(geometricProgession(0.3, level, 20), 5) + '%'
      },
      mods: [physScaling]
    }
  },
  orbs: 10
}