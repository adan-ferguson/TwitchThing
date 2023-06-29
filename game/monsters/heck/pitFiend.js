import { simpleAttackAction } from '../../commonTemplates/simpleAttackAction.js'

export default function(){
  return {
    baseStats: {
      hpMax: '+50%',
      speed: 20,
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
      }
    ]
  }
}