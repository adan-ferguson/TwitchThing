export default function(level){
  const magicPower = (0.8 + level * 0.4) + 'x'
  return {
    effect: {
      metaEffects: [{
        subjectKey: 'attached',
        effectModification: {
          abilityModification: {
            trigger: 'active',
            exclusiveStats: {
              magicPower,
              cooldownMultiplier: Math.pow(0.9, level - 1) * 0.8
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
      },
      attached: {
        restrictions: {
          hasAbility: 'active'
        }
      }
    },
    orbs: 1 + level * 4
  }
}