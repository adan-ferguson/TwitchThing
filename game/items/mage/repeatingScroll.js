export default function(level){
  return {
    displayName: 'Duplication Scroll',
    effect: {
      metaEffects: [{
        subjectKey: 'attached',
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