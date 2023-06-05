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
            turnRefund: level * 0.5,
            exclusiveStats: {
              magicPower: multi,
              physPower: multi,
            },
          }
        }
      }],
      tags: ['scroll'],
    },
    orbs: -4 + level * 7,
    maxLevel: 2
  }
}