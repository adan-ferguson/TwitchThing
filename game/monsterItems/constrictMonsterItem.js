import statusEffectAction from '../actions/statusEffectAction.js'
import { freezeActionBarMod } from '../mods/combined.js'
import damageSelfAction from '../actions/damageSelfAction.js'

export default function({
  initialCooldown = 5000
} = {}){
  return {
    name: 'Constrict',
    abilities: {
      active: {
        initialCooldown,
        uses: 1,
        description: 'Wrap the opponent up and deal physical damage over time. Length is longer vs opponents with lower phys power.',
        actions: [
          ({ combat, owner }) => {
            const duration = 4000 * owner.physPower / combat.getEnemyOf(owner).physPower
            owner.nextTurnOffset = -duration
            return statusEffectAction({
              affects: 'enemy',
              effect: {
                duration,
                displayName: 'Constricted',
                mods: [freezeActionBarMod],
                abilities: {
                  tick: {
                    cooldown: 500,
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