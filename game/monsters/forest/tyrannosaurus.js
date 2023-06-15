import { biteMonsterItem } from '../../commonTemplates/biteMonsterItem.js'

export default function(){
  return {
    baseStats: {
      physPower: '+30%',
      speed: -20,
      hpMax: '+200%'
    },
    items: [
      {
        name: 'Enrage',
        effect: {
          metaEffects: [{
            subjectKey: 'self',
            conditions: {
              owner: {
                hpPctBelow: 0.5
              }
            },
            effectModification: {
              stats: {
                speed: 50,
                physPower: '+20%'
              }
            }
          }]
        }
      },
      biteMonsterItem(11000, 1.4)
    ]
  }
}