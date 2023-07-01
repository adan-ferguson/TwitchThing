import { simpleAttackAction } from '../../commonTemplates/simpleAttackAction.js'

export default function(){
  return {
    baseStats: {
      hpMax: '+1000%',
      speed: -50,
      physPower: '+50%',
      magicPower: '+50%'
    },
    items: [
      {
        name: 'TERRIBLE Situation',
        effect: {
          abilities: [{
            uncancellable: true,
            trigger: 'startOfCombat',
            actions: [{
              terribleSituation: true
            }]
          }]
        }
      },
      {
        name: 'Blightning Bolt',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 10000,
            cooldown: 20000,
            actions: [simpleAttackAction('magic', 2),{
              modifyAbility: {
                targets: 'enemy',
                trigger: 'active',
                modification: {
                  cooldownRemaining: 5000
                }
              }
            }]
          }]
        }
      },
      {
        name: 'Pain Train',
        effect: {
          abilities: [{
            initialCooldown: 20000,
            cooldown: 40000,
            trigger: 'active',
            actions: [{
              painTrain: {
                magicPower: 1
              }
            }]
          }]
        }
      }
    ]
  }
}