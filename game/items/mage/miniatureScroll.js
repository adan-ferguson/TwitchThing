export default function(level){
  const exclusiveStats = {
    magicPower: '0.5x',
    physPower: '0.5x',
  }
  const turnRefund = level < 2 ? 0.5 : 1
  const effect = {
    metaEffects: [{
      subject: { key: 'attached' },
      effectModification: {
        abilityModification: {
          abilityModificationId: 'miniatureScroll',
          trigger: 'active',
          turnRefund,
          exclusiveStats: level < 3 ? exclusiveStats : null,
        }
      }
    }],
    tags: ['scroll'],
  }
  return {
    effect,
    orbs: 1 + 2 * level,
    maxLevel: 3
  }
}