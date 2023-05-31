import { geometricProgression } from '../../growthFunctions.js'

export default function(level){
  const magicPower = (2 + geometricProgression(0.25, level, 1, 0.25)) + 'x'
  const time = 2 + level
  return {
    effect: {
      metaEffects: [{
        subject: 'attached',
        effect: {
          exclusiveStats: {
            magicPower
          }
        },
        changeAbility: {
          extraAction: {
            applyStatusEffect: {
              targets: 'self',
              statusEffect: {
                base: {
                  stunned: {
                    time
                  }
                },
                persisting: true
              }
            }
          }
        }
      }],
    },
    orbs: 5 * level,
    vars: {
      targets: 'attached'
    }
  }
}