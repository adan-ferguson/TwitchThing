import statusEffect from '../../actions/generic/statusEffect.js'
import takeDamage from '../../actions/generic/takeDamage.js'
import attack from '../../actions/generic/attack.js'

export default {
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
    physPower: '+10%'
  },
  description: 'This is a generic sword for testing.',
  orbs: 1,
  displayName: 'Sword With Display Name'
}