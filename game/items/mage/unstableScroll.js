import { geometricProgression } from '../../growthFunctions.js'

export default function(level){
  const magicPower = (1 + geometricProgression(0.20, level, 1, 0.05)) + 'x'
  const stunDuration = 1000 + level * 1000
  return {
    effect: {
      metaEffects: [{
        subjectKey: 'attached',
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
                    stunned: stunDuration
                  },
                  persisting: true
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