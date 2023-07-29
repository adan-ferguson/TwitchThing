import { simpleAttackAction } from '../../commonMechanics/simpleAttackAction.js'

export default function(){
  return {
    baseStats: {
      hpMax: '+666%',
      speed: -20,
      physPower: '+25%',
      magicPower: '+150%'
    },
    items: [
      {
        name: 'Blightning Bolt',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 10000,
            cooldown: 20000,
            actions: [simpleAttackAction('magic', 1),{
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
        name: 'Bane Train',
        effect: {
          abilities: [{
            initialCooldown: 20000,
            trigger: 'active',
            actions: [{
              modifyStatusEffect: {
                targets: 'target',
                subject: {
                  polarity: 'buff'
                },
                count: 2,
                modification: {
                  remove: true
                }
              }
            }, simpleAttackAction('magic', 1)]
          }]
        }
      },
      {
        name: 'Dark Armor (of Doom)',
        effect: {
          abilities: [{
            trigger: 'startOfCombat',
            uses: 1,
            actions: [{
              applyStatusEffect: {
                targets: 'self',
                statusEffect: {
                  name: 'darkArmor',
                  startingStacks: 20,
                  polarity: 'buff',
                  stats: {
                    physDef: '10%',
                    magicDef: '10%'
                  },
                  abilities: [{
                    trigger: 'instant',
                    initialCooldown: 3000,
                    actions: [{
                      modifyStatusEffect: {
                        subject: {
                          key: 'self'
                        },
                        modification: {
                          stacks: -1
                        }
                      }
                    }]
                  }]
                }
              }
            }]
          }]
        }
      },
    ]
  }
}