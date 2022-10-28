import statusEffectAction from '../../actions/statusEffectAction.js'
import damageSelfAction from '../../actions/damageSelfAction.js'
import { freezeActionBarMod } from '../../mods/combined.js'

export default {
  baseStats: {
    magicDef: '+20%',
    speed: '-10%'
  },
  items: [{
    name: 'Constrict',
    abilities: {
      active: {
        initialCooldown: 5000,
        uses: 1,
        description: 'Wrap the opponent up and deal physical damage over time. Length is longer vs opponents with lower phys power.',
        actions: [
          (combat, owner, prevResults) => {
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
  }]
}