import { geometricProgression } from '../../growthFunctions.js'

export default function(level){
  const magicPower = (1.5 + geometricProgression(0.25, level, 1, 0.05)) + 'x'
  const stunDuration = 500 + level * 1500
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
    orbs: 3 + 2 * level
  }
}