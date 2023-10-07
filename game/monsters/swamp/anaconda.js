import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: toPct(0.4 + tier * 0.8),
      speed: -30 + tier * 40,
      physPower: '+60%'
    },
    items: [
      {
        name: 'Constrict',
        effect: {
          abilities: [{
            trigger: 'active',
            uses: 1,
            abilityId: 'constrict',
            actions: [{
              applyStatusEffect: {
                targets: 'enemy',
                statusEffect: {
                  polarity: 'debuff',
                  name: 'constricted',
                  stats: {
                    speed: -10 - tier * 20,
                  },
                  stacking: 'stack',
                  abilities: [{
                    trigger: 'instant',
                    initialCooldown: 3000,
                    actions: [{
                      modifyStatusEffect: {
                        targets: 'self',
                        subject: {
                          key: 'self'
                        },
                        modification: {
                          stacks: 1
                        }
                      }
                    }]
                  }]
                }
              }
            }]
          }]
        }
      }
    ]
  }
}