import { geometricProgression } from '../../growthFunctions.js'

export default function(level){
  const magicPower = (1.5 + geometricProgression(0.20, level, 0.7, 0.05)) + 'x'
  const stunDuration = 1000 + level * 1000
  return {
    effect: {
      metaEffects: [{
        subject: { key: 'attached' },
        effectModification: {
          abilityModification: {
            trigger: 'active',
            abilityModificationId: 'unstableScroll',
            exclusiveStats: {
              magicPower
            },
            addAction: {
              applyStatusEffect: {
                targets: 'self',
                statusEffect: {
                  base: {
                    stunned: { duration: stunDuration }
                  },
                  persisting: true,
                  stackingId: 'unstableStun',
                  diminishingReturns: false
                }
              }
            },
            vars: { stunDuration }
          }
        },
      }],
      tags: ['scroll']
    },
    orbs: 5 * level
  }
}