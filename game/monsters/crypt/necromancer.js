import { barrierAction } from '../../commonMechanics/barrierAction.js'

export default function(){
  return {
    baseStats: {
      hpMax: '+10%',
      speed: -65, // keep this desynced
      magicPower: '+50%',
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