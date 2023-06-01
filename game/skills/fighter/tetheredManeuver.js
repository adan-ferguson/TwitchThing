export default function(level){
  // TODO: rankups w/ cooldown reduction for both
  return {
    effect: {
      abilities: [{
        abilityId: 'tetheredManeuver',
        trigger: { useAbility: true },
        conditions: {
          source: 'aboveNeighbour'
        },
        actions: [{
          useAbility: {
            subjectKey: 'belowNeighbour',
            trigger: 'active',
          }
        }]
      }]
    },
    maxLevel: 1
  }
}