export default function(level){
  const exclusiveStats = level < 3 ? {
    magicPower: '0.5x',
    physPower: '0.5x',
  } : {}
  const turnRefund = level < 2 ? 0.5 : 1
  return {
    effect: {
      metaEffects: [{
        subject: { key: 'attached' },
        effectModification: {
          abilityModification: {
            abilityModificationId: 'miniatureScroll',
            trigger: 'active',
            turnRefund,
            exclusiveStats,
          }
        }
      }],
      tags: ['scroll'],
    },
    orbs: 3 * level,
    maxLevel: 3
  }
}