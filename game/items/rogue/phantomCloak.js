import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  const stats = level === 1 ? {} : {
    dodgeChance: exponentialPercentage(0.12, level - 2, 0.12)
  }
  return {
    effect: {
      stats,
      metaEffects: [{
        metaEffectId: 'phantomCloak',
        subject: { key: 'attached' },
        effectModification: {
          abilityModification: {
            trigger: 'active',
            newTrigger: 'thwart'
          }
        }
      }],
    },
    orbs: 9 + level * 3,
  }
}