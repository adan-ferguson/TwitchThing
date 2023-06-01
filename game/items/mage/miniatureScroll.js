export default function(level){
  const multi = 0.5 + 'x'
  return {
    effect: {
      metaEffects: [{
        subjectKey: 'attached',
        effectModification: {
          abilityModification: {
            abilityModificationId: 'miniatureScroll',
            trigger: 'active',
            turnTime: 1 - level * 0.5,
            exclusiveStats: {
              magicPower: multi,
              physPower: multi,
            },
          }
        }
      }],
      tags: ['scroll'],
    },
    orbs: -7 + level * 10,
    maxLevel: 2
  }
}