import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        dodgeChance: exponentialPercentage(0.1, level - 1, 0.1)
      },
      metaEffects: [{
        metaEffectId: 'phantomCloak',
        subject: { key: 'attached' },
        effectModification: {
          abilityModification: {
            trigger: 'active',
            newTrigger: 'thwart',
            cooldown: -5000 * (1 + level)
          }
        }
      }],
    },
    orbs: 6 + level * 6,
  }
}