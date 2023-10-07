import { simpleAttackAction } from '../../commonMechanics/simpleAttackAction.js'
import { darkArmorOfDoomEffect } from '../../commonMechanics/effects/darkArmorOfDoomEffect.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: '+666%',
      speed: 10 + tier * 70,
      physPower: '-50%',
      magicPower: '+150%'
    },
    items: [
      {
        name: 'Blightning Bolt',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 10000 - tier * 5000,
            cooldown: 20000 - tier * 10000,
            actions: [simpleAttackAction('magic', 1),{
              modifyAbility: {
                targets: 'enemy',
                trigger: 'active',
                modification: {
                  cooldownRemaining: { flat: 5000 }
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
            initialCooldown: 20000 - tier * 10000,
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
        effect: darkArmorOfDoomEffect(20 + tier * 20)
      },
      {
        name: 'Triple Attack',
        effect: {
          stats: {
            basicAttacks: 2,
          }
        }
      }
    ]
  }
}