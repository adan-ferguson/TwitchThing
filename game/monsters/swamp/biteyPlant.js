import { biteMonsterItem } from '../../commonTemplates/biteMonsterItem.js'

export default function(){
  return {
    baseStats: {
      physPower: '-20%',
      magicPower: '-20%',
      speed: 0,
      hpMax: '-20%',
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