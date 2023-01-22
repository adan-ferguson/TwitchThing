import { bossMod } from '../../mods/combined.js'
import constrictMonsterItem from '../../monsterItems/constrictMonsterItem.js'
import gainHealthAction from '../../actions/gainHealthAction.js'
import { fillArray } from '../../utilFunctions.js'
import attackAction from '../../actions/attackAction.js'

export default {
  baseStats: {
    physPower: '+60%',
    speed: -40,
    hpMax: '+400%'
  },
  items: [
    {
      name: 'Boss',
      mods: [bossMod]
    },
    constrictMonsterItem({
      initialCooldown: 15000,
      cooldown: 45000
    }),
    {
      name: 'Multi-Attack',
      abilities: {
        active: {
          initialCooldown: 5000,
          cooldown: 30000,
          description: 'Attack 5 times for [physAttack0.4] damage.',
          actions:
            fillArray(() => attackAction({
              damageMulti: 0.5
            }), 5)
        }
      }
    },
    {
      name: 'Regenerate',
      abilities: {
        tick: {
          initialCooldown: 5000,
          actions: [
            gainHealthAction({
              scaling: { magicPower: 0.5 }
            })
          ]
        }
      }
    }
  ]
}