export default function(level){
  const cooldownMultiplier = 0.9 * Math.pow(0.8, level - 1) + 'x'
  return {
    effect: {
      abilities: [{
        abilityId: 'tetheredManeuver',
        trigger: 'useAbility',
        conditions: {
          source: {
            subjectKey: 'aboveNeighbour'
          }
        },
        actions: [{
          useAbility: {
            subjectKey: 'belowNeighbour',
            trigger: 'active',
          }
        }]
      }],
      metaEffects: [{
        subject: { key: 'neighbouring' },
        effectModification: {
          exclusiveStats: {
            cooldownMultiplier
          }
        }
      }],
      vars: {
        cooldownMultiplier
      }
    },
    displayName: 'Tandem Maneuver'
  }
}