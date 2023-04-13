import statusEffectAction from '../actions/actionDefs/common/statusEffectAction.js'
import { freezeActionBarMod } from '../mods/combined.js'
import damageAction from '../actions/actionDefs/common/dealDamageAction.js'
import takeDamageAction from '../actions/actionDefs/common/takeDamageAction.js'

export default function(def){
  return {
    name: 'Constrict',
    abilities: {
      active: {
        ...def,
        description: 'Wrap the opponent up and deal [physScaling1.6] physical damage over 5 seconds.',
        actions: [
          ({ combat, owner }) => {
            const duration = 5000
            owner.nextTurnOffset = -duration
            return statusEffectAction({
              affects: 'enemy',
              effect: {
                duration,
                displayName: 'Constricted',
                mods: [freezeActionBarMod],
                abilities: {
                  tick: {
                    cooldown: 1000,
                    actions: [
                      takeDamageAction({
                        scaling: {
                          flat: owner.physPower * 0.16
                        }
                      })
                    ]
                  }
                }
              }
            })
          }
        ]
      }
    }
  }
}