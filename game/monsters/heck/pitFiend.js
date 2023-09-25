import { simpleAttackAction } from '../../commonMechanics/simpleAttackAction.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: '+40%',
      speed: -5 + tier * 70,
      physPower: toPct(0.2 + tier * 0.6),
      magicPower: toPct(0.2 + tier * 1.4),
    },
    items: [
      {
        name: 'Flame Slash',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 8000 - tier * 4000,
            actions: [
              simpleAttackAction('phys'),
              simpleAttackAction('magic')
            ]
          }]
        }
      },{
        name: 'Get Mad!',
        effect: {
          metaEffects: [{
            metaEffectId: 'getMad',
            subject: {
              polarity: 'debuff'
            },
            effectModification: {
              stats: {
                speed: 35 + tier * 65,
              }
            }
          }]
        }
      }
    ]
  }
}