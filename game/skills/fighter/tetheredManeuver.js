export default function(level){
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
            subject: 'belowNeighbour',
            trigger: 'active',
          }
        }]
      }]
    },
    vars: {
      targets: 'neighbouring'
    },
    maxLevel: 1
  }
}