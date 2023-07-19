import { roundToFixed } from '../../utilFunctions.js'

export default function(level){
  const magicPower = roundToFixed(1.6 + level * 0.4, 2) + 'x'
  return {
    effect: {
      metaEffects: [{
        subject: { key: 'attached' },
        effectModification: {
          abilityModification: {
            trigger: 'active',
            exclusiveStats: {
              magicPower,
              cooldownMultiplier: Math.pow(0.85, level - 1) * 0.8 + 'x'
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
    orbs: 4 + level * 3
  }
}