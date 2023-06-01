export default function(level){
  return {
    loadoutModifiers: {
      attached: {
        restrictions: {
          hasAbility: 'active'
        }
      }
    },
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
    orbs: level * 10,
  }
}