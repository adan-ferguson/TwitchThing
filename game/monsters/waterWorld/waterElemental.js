import { barrierAction } from '../../commonMechanics/barrierAction.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return{
    baseStats: {
      hpMax: toPct(-0.1 + tier * 0.4),
      magicPower: toPct(1.3 + tier * 1.3),
      speed: 30 + tier * 100
    },
    items: [
      {
        name: 'Water Shield',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 20000,
            actions: [barrierAction({
              hpMax: 0.35
            },{
              stats: {
                physPower: tier ? '10x' : '2x',
                magicPower: tier ? '10x' : '2x'
              }
            })]
          }]
        }
      },
      {
        name: 'Tidal Wave',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 10000,
            cooldown: 20000,
            actions: [[{
              attack: {
                scaling: {
                  magicPower: 1
                },
                damageType: 'magic'
              } }],[{
              gainHealth: {
                scaling: {
                  magicPower: 1
                }
              }
            }]]
          }]
        }
      }
    ]
  }
}