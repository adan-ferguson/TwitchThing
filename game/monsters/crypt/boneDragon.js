import { toPct } from '../../utilFunctions.js'
import { regenerationEffect } from '../../commonMechanics/effects/regenerationEffect.js'

export default function(tier){

  const items = [
    {
      name: 'Necrotic Breath',
      effect: {
        abilities: [{
          trigger: 'active',
          cooldown: tier ? 20000 : 30000,
          initialCooldown: tier ? 0 : 10000 ,
          actions: [{
            attack: {
              scaling: {
                magicPower: 3
              },
              damageType: 'magic'
            }
          },{
            applyStatusEffect: {
              targets: 'enemy',
              statusEffect: {
                stacking: 'stack',
                polarity: 'debuff',
                persisting: false,
                stats: {
                  physPower: '0.7x',
                  magicPower: '0.7x',
                },
                name: 'Aged'
              }
            }
          }]
        }]
      }
    }
  ]

  if(tier){
    items.push(
      {
        name: 'Hyper Regeneration',
        effect: regenerationEffect(0.1)
      }
    )
  }

  return {
    baseStats: {
      physPower: '+90%',
      speed: -20 + tier * 70,
      hpMax: toPct(3 + tier * 7)
    },
    items
  }
}