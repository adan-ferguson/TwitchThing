import { biteMonsterItem } from '../../commonMechanics/biteMonsterItem.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  const bonusStats = {
    speed: 100,
    physPower: '+60%'
  }
  if(tier){
    bonusStats.physDef = toPct(0.8)
    bonusStats.magicDef = toPct(0.8)
  }
  return {
    baseStats: {
      physPower: '+20%',
      speed: -20 + tier * 60,
      hpMax: toPct(2.2 + tier * 2.2)
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
              stats: bonusStats
            }
          }]
        }
      },
      biteMonsterItem(11000, 1.4)
    ]
  }
}