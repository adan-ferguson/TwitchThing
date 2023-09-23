import { biteMonsterItem } from '../../commonMechanics/biteMonsterItem.js'
import { regenerationEffect } from '../../commonMechanics/effects/regenerationEffect.js'
import { toPct } from '../../utilFunctions.js'
import { simpleAttackAction } from '../../commonMechanics/simpleAttackAction.js'

export default function(tier){

  const items = [
    {
      name: 'Fire Bolt',
      effect: {
        abilities: [{
          trigger: 'active',
          cooldown: 5000,
          actions: [
            simpleAttackAction('magic', 1.9)
          ]
        }]
      }
    },
    biteMonsterItem(5000, 1.3),
  ]

  if(tier){
    items.push(
      {
        name: 'Photosynthesis',
        effect: regenerationEffect(0.1)
      }
    )
  }

  return {
    baseStats: {
      physPower: '-10%',
      magicPower: '-10%',
      speed: 5,
      hpMax: toPct(-0.1 + tier * 0.8),
    },
    items,
  }
}