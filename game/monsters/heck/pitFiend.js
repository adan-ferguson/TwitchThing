import { simpleAttackAction } from '../../commonMechanics/simpleAttackAction.js'

export default function(){
  return {
    baseStats: {
      hpMax: '+40%',
      speed: -25,
      physPower: '+20%',
      magicPower: '+20%',
    },
    items: [
      {
        name: 'Flame Slash',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 8000,
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
                speed: 25
              }
            }
          }]
        }
      }
    ]
  }
}