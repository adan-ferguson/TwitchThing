import { barrierAction } from '../../commonMechanics/barrierAction.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: '+10%',
      speed: -65 + tier * 60, // keep this desynced
      magicPower: toPct(0.5 + tier * 0.5),
      physPower: '-40%'
    },
    items: [
      {
        name: 'Summon Skeleton Archer',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 6000,
            actions: [{
              applyStatusEffect: {
                targets: 'self',
                statusEffect: {
                  statusEffectId: 'skeletonArcher',
                  name: 'Skeleton Archer',
                  polarity: 'buff',
                  abilities: [{
                    trigger: 'instant',
                    initialCooldown: 3000,
                    repetitions: 1 + tier * 1,
                    actions: [{
                      attack: {
                        scaling: {
                          magicPower: 0.3
                        },
                        damageType: 'phys'
                      }
                    }]
                  }]
                }
              }
            }]
          }]
        }
      },
      {
        name: 'Bone Shield',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 6000,
            actions: [barrierAction({
              magicPower: 2
            }, { name: 'Bone Shield' })]
          }]
        }
      },
    ]
  }
}