import { barrierAction } from '../../commonTemplates/barrierAction.js'

export default function(){
  return {
    baseStats: {
      hpMax: '+10%',
      speed: -65, // keep this desynced
      magicPower: '+40%',
      physPower: '-40%'
    },
    items: [
      {
        name: 'Summon Skeleton Archer',
        effect: {
          abilities: [{
            tags: ['spell'],
            trigger: 'active',
            cooldown: 6000,
            abilityId: 'summonSkeleton',
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
                          magicPower: 0.4
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
            tags: ['spell'],
            trigger: 'active',
            cooldown: 6000,
            actions: [barrierAction({
              magicPower: 0.8
            }, { name: 'Bone Shield' })]
          }]
        }
      },
    ]
  }
}