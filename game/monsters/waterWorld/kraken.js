import { bossMod } from '../../mods/combined.js'
import constrictMonsterItem from '../../monsterItems/constrictMonsterItem.js'
import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  baseStats: {
    physPower: '+90%',
    speed: -50,
    hpMax: '+300%'
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
      name: 'Regenerate',
      abilities: {
        tick: {
          initialCooldown: 5000,
          actions: [
            gainHealthAction({
              scaling: { magicPower: 0.7 }
            })
          ]
        }
      }
    }
  ]
}