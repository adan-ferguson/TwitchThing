import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      speed: -10 + tier * 30,
      hpMax: toPct(0.4 + tier * 0.2),
      physDef: tier ? '60%' : '20%'
    },
    items: [{
      name: 'Ride Down',
      effect: {
        abilities: [{
          trigger: 'active',
          cooldown: 10000,
          actions: [{
            attack: {
              scaling: {
                physPower: 1.4
              }
            }
          }]
        }]
      }
    }]
  }
}