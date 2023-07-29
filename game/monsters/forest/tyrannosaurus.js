import { biteMonsterItem } from '../../commonMechanics/biteMonsterItem.js'

export default function(){
  return {
    baseStats: {
      physPower: '+20%',
      speed: -20,
      hpMax: '+220%'
    },
    items: [
      {
        name: 'Enrage',
        effect: {
          metaEffects: [{
            subject: { key: 'self' },
            conditions: {
              owner: {
                hpPctBelow: 0.5
              }
            },
            effectModification: {
              stats: {
                speed: 100,
                physPower: '+60%'
              }
            }
          }]
        }
      },
      biteMonsterItem(11000, 1.4)
    ]
  }
}