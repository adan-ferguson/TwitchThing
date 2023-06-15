export default function(level){
  const magicPower = (1 + level * 0.4) + 'x'
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
          }
        }
      }],
      tags: ['scroll'],
    },
    orbs: 1 + level * 3
  }
}