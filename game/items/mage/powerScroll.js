export default function(level){
  const magicPower = (1.4 + level * 0.3) + 'x'
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
    orbs: 3 + level * 1
  }
}