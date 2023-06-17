import { roundToFixed } from '../../utilFunctions.js'

export default function(level){
  const magicPower = roundToFixed(1.2 + level * 0.3, 2) + 'x'
  return {
    effect: {
      metaEffects: [{
        subject: { key: 'attached' },
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
    loadoutModifiers: [{
      subjectKey: 'self',
      restrictions: {
        slot: 1
      }
    }],
    orbs: 5 + level * 3
  }
}