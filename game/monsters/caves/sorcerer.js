import { magicAttackItem } from '../../commonMechanics/magicAttackItem.js'
import { counterspellAbility } from '../../commonMechanics/counterspellAbility.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){

  const items = [
    {
      name: 'Lightning Bolt',
      effect: {
        abilities: [{
          trigger: 'active',
          initialCooldown: 4000,
          cooldown: 8000,
          actions: [{
            attack: {
              scaling: {
                magicPower: 2
              },
              damageType: 'magic',
              range: [0, 1]
            }
          }]
        }]
      }
    }
  ]

  if(tier){
    items.push(
      {
        name: 'Counterspell',
        effect: {
          abilities: [counterspellAbility(15000)]
        }
      },
      {
        name: 'Counterspell',
        effect: {
          abilities: [counterspellAbility(15000)]
        }
      },
    )
  }

  return {
    baseStats: {
      hpMax: '+5%',
      magicPower: toPct(1.2 + tier * 1.2),
      physPower: '-30%',
      speed: 25,
    },
    items,
  }
}