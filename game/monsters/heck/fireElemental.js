import { barrierAction } from '../../commonMechanics/barrierAction.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: toPct(0.2 + tier * 0.6),
      physPower: '-20%',
      magicPower: '-20%',
      speed: 20 + tier * 40,
    },
    items: [
      {
        name: 'Fire Shield',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 20000,
            actions: [barrierAction({
              hpMax: 0.4
            },{
              stats: {
                physPower: tier ? '10x' : '2x',
                magicPower: tier ? '10x' : '2x'
              }
            })]
          }]
        }
      },
      {
        name: 'Fire Blast',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 16000,
            cooldown: 20000,
            actions: [
              {
                attack: {
                  scaling: {
                    magicPower: 2
                  },
                  damageType: 'magic'
                }
              },{
                applyStatusEffect: {
                  statusEffect: {
                    base: {
                      damageOverTime: {
                        damage: {
                          scaledNumber: {
                            magicPower: 0.1
                          }
                        },
                        damageType: 'magic'
                      }
                    },
                    name: 'seriousBurn',
                    duration: 60000,
                    persisting: true
                  },
                  targets: 'enemy',
                }
              }
            ]
          }]
        }
      },
      {
        name: 'Fire Aura',
        effect: {
          abilities: [{
            trigger: 'instant',
            initialCooldown: 3000,
            actions: [{
              dealDamage: {
                targets: 'enemy',
                damageType: 'magic',
                scaling: {
                  magicPower: 0.1
                }
              }
            },{
              gainHealth: {
                scaling: {
                  magicPower: 0.1
                }
              }
            }]
          }]
        }
      },
      {
        name: 'Fire Sale',
        effect: {}
      }
    ]
  }
}