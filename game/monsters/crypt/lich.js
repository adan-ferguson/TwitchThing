import { barrierAction } from '../../commonMechanics/barrierAction.js'
import { magicAttackItem } from '../../commonMechanics/magicAttackItem.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){

  const items = [
    magicAttackItem(),
    {
      name: 'EVIL Barrier',
      effect: {
        abilities: [{
          trigger: 'active',
          cooldown: 12000,
          actions: [barrierAction({
            magicPower: 1.8 + tier * 0.9
          }, { name: 'EVIL Barrier' })]
        }]
      }
    },
    {
      name: 'Death Kill Beam',
      effect: {
        abilities: [{
          trigger: 'active',
          initialCooldown: 20000,
          actions: [{
            attack: {
              damageType: 'magic',
              scaling: {
                magicPower: 4 + tier * 8
              }
            }
          }]
        }]
      }
    },
  ]

  return {
    baseStats: {
      magicDef: toPct(0.4 + tier * 0.4),
      physPower: '-50%',
      magicPower: toPct(0.7),
      hpMax: toPct(-0.4 + tier * 0.2),
      speed: -40 + tier * 60,
    },
    items
  }
}