import statusEffectAction from '../actions/statusEffectAction.js'
import { freezeActionBarMod } from '../mods/combined.js'
import damageSelfAction from '../actions/damageSelfAction.js'
import { minMax } from '../utilFunctions.js'

export default function({
  initialCooldown = 5000
} = {}){
  return {
    name: 'Constrict',
    abilities: {
      active: {
        initialCooldown,
        uses: 1,
        description: 'Wrap the opponent up and deal [physScaling0.16] physical damage/s over time. Length is longer vs opponents with lower phys power.',
        actions: [
          ({ combat, owner }) => {
            const factor = minMax(0, owner.physPower / combat.getEnemyOf(owner).physPower, 2)
            const duration = 5000 * factor
            console.log(factor)
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
                      damageSelfAction({
                        damage: owner.physPower * 0.16
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