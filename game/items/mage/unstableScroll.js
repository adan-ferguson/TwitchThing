import { geometricProgression } from '../../growthFunctions.js'

export default function(level){
  const magicPower = (2 + geometricProgression(0.25, level, 1, 0.25)) + 'x'
  const stunDuration = 2 + level
  return {
    effect: {
      metaEffects: [{
        subjectKey: 'attached',
        effectModification: {
          abilityModification: {
            trigger: 'active',
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
            }
          }
        },
      }],
      tags: ['scroll']
    },
    orbs: 5 * level
  }
}