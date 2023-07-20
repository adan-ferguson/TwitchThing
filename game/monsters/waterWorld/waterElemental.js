import { barrierAction } from '../../commonMechanics/barrierAction.js'

export default function(){
  return{
    baseStats: {
      hpMax: '-30%',
      magicPower: '+100%',
      speed: 30
    },
    items: [
      {
        name: 'Water Shield',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 20000,
            actions: [barrierAction({
              hpMax: 0.25
            },{
              stats: {
                physPower: '2x',
                magicPower: '2x'
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
            initialCooldown: 15000,
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