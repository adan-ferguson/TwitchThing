import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: '-20%',
      physPower: toPct(-0.1 + tier * 0.3),
      speed: 30 + tier * 70
    },
    items: [
      {
        name: 'Cannon Shot',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 6000,
            exclusiveStats: {
              critDamage: toPct(2 + tier * 18),
              critChance: 1 / 3
            },
            actions: [{
              attack: {
                scaling: {
                  physPower: 1.5
                }
              }
            }]
          }]
        }
      }
    ]
  }
}