import statusEffect from '../../actions/generic/statusEffectAction.js'
import takeDamage from '../../actions/generic/takeDamage.js'
import attack from '../../actions/generic/attack.js'
import { scaledValueCumulative } from '../../scaledValue.js'
import physScaling from '../../mods/generic/physScaling.js'

const SCALING = 0.2
const BASE = 4

export default {
  levelFn: level => ({
    abilities: {
      active: {
        cooldown: 10000,
        actions: [
          takeDamage({
            damagePct: 0.1,
            ignoreDefense: true
          }),
          (combat, owner, prevResults) => {
            const dmgResult = prevResults.at(-1)
            return statusEffect({
              effect: {
                duration: 0,
                stats: {
                  physPower: dmgResult.data.finalDamage * 1.5
                }
              }
            })
          },
          attack()
        ]
      }
    },
    stats: {
      physPower: Math.ceil(scaledValueCumulative(SCALING, level, BASE))
    },
  }),
  description: 'This is a generic sword for testing.',
  displayName: 'Sword With Display Name',
  orbs: 1,
  mods: [physScaling]
}