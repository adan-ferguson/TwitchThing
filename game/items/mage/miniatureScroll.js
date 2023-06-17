export default function(level){
  const multi = 0.5 + 'x'
  return {
    effect: {
      metaEffects: [{
        subject: { key: 'attached' },
        effectModification: {
          abilityModification: {
            abilityModificationId: 'miniatureScroll',
            trigger: 'active',
            turnRefund: 1,
            exclusiveStats: {
              magicPower: multi,
              physPower: multi,
            },
          }
        }
      }],
      tags: ['scroll'],
    },
    orbs: 4,
    maxLevel: 1
  }
}