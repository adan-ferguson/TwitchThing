export default function(level){
  return {
    displayName: 'Duplication Scroll',
    effect: {
      metaEffects: [{
        subject: { key: 'attached' },
        effectModification: {
          abilityModification: {
            trigger: 'active',
            repetitions: level
          }
        }
      }],
      tags: ['scroll'],
    },
    orbs: 3 + level * 7,
  }
}