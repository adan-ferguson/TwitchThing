export default function(level){
  const damageDealt = 1.5 + level * 0.5
  const value = 0.5 + level * 0.5
  return {
    effect: {
      metaEffects: [{
        subject: { key: 'attached' },
        effectModification: {
          addAbility: {
            trigger: 'kill',
            conditions: {
              source: {
                subjectKey: 'self',
                trigger: 'active'
              }
            },
            actions: [{
              theBountyCollectorKill: {
                value
              }
            }]
          },
          abilityModification: {
            trigger: 'active',
            exclusiveStats: {
              damageDealt
            },
          },
        }
      }],
    },
    orbs: 5 + level * 10,
  }
}