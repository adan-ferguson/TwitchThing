import { toPct } from '../../utilFunctions.js'

export default function(tier){

  return {
    baseStats: {
      hpMax: '+100%',
      speed: 70,
      physPower: '-10%',
    },
    items: [
      {
        name: 'Grenade Launcher',
        effect: {
          stats: {
            critChance: 0.2,
            critDamage: toPct(1 + tier * 2)
          }
        }
      },
      {
        name: 'Cybernetic Armor',
        effect: {
          effectId: 'behemothCarapace',
          stats: {
            damageThreshold: tier ? 1 : 0.05
          }
        }
      }
    ]
  }
}