import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      physPower: '+40%',
      speed: -30,
      hpMax: toPct(3.5 + tier * 16.5),
    },
    items: [
      {
        name: 'Execute',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 30000,
            actions: [{
              attack: {
                scaling: {
                  physPower: 5 + tier * 15,
                },
                cantDodge: tier ? true : false,
                cantMiss: tier ? true : false,
              }
            }]
          }]
        }
      }
    ]
  }
}