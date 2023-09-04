import { biteMonsterItem } from '../../commonMechanics/biteMonsterItem.js'

export default function(){
  return {
    baseStats: {
      physPower: '-10%',
      magicPower: '-10%',
      speed: 5,
      hpMax: '-10%',
    },
    items: [
      {
        name: 'Fire Bolt',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 5000,
            actions: [{
              attack: {
                scaling: {
                  magicPower: 1.9
                }
              }
            }]
          }]
        }
      },
      biteMonsterItem(5000, 1.3),
    ]
  }
}