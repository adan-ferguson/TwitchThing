import { lightningStormAbility } from '../../commonMechanics/lightningStormAbility.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      physPower: '-50%',
      magicPower: toPct(tier ? 1.8 : 0.75),
      speed: 20,
      hpMax: toPct(tier ? 0.3 : -0.5),
      magicDef: toPct(tier ? 0.8 : 0.4),
    },
    items: [
      {
        name: 'Lightning Storm',
        effect: {
          abilities: [{
            ...lightningStormAbility(1),
            uses: 1
          }]
        }
      },
      {
        name: 'Lightning Bolt',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: tier ? 1000 : 3000,
            actions: [{
              attack: {
                scaling: {
                  magicPower: 2.5
                },
                damageType: 'magic',
                range: [0, 2]
              }
            }]
          }]
        }
      }
    ]
  }
}