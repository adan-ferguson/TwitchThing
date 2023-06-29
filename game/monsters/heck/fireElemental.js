import { barrierAction } from '../../commonTemplates/barrierAction.js'

export default function(){
  return {
    baseStats: {
      hpMax: '-20%',
      physPower: '-20%',
      magicPower: '-20%',
      speed: 10,
    },
    items: [
      {
        name: 'Fire Shield',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 20000,
            actions: [barrierAction({
              hpMax: 0.2
            },{
              stats: {
                physPower: '2x',
                magicPower: '2x'
              }
            })]
          }]
        }
      },
      {
        name: 'Fire Wave',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 15000,
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
                            magicPower: 0.2
                          }
                        },
                        damageType: 'magic'
                      }
                    },
                    name: 'burned',
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
                  magicPower: 0.2
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