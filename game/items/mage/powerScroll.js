export default function(level){
  const magicPower = (1 + level * 0.4) + 'x'
  return {
    effect: {
      metaEffects: [{
        subject: { key: 'attached' },
        effectModification: {
          abilityModification: {
            trigger: 'active',
            exclusiveStats: {
              magicPower
            },
          }
        }
      }],
      tags: ['scroll'],
    },
    orbs: 1 + level * 3
  }
}