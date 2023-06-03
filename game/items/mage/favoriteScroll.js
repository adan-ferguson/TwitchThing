import { roundToFixed } from '../../utilFunctions.js'

export default function(level){
  const magicPower = roundToFixed(0.8 + level * 0.4, 2) + 'x'
  return {
    effect: {
      metaEffects: [{
        subjectKey: 'attached',
        effectModification: {
          abilityModification: {
            trigger: 'active',
            exclusiveStats: {
              magicPower,
              cooldownMultiplier: Math.pow(0.9, level - 1) * 0.7
            },
          }
        }
      }],
      tags: ['scroll'],
    },
    loadoutModifiers: {
      self: {
        restrictions: {
          slot: 1
        }
      }
    },
    orbs: 1 + level * 4
  }
}