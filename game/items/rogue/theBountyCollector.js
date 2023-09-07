export default function(level){
  const goldReward = `${1 + level * 3}x`
  return {
    effect: {
      abilities: [{
        trigger: 'kill',
        abilityId: 'bountyCollector',
        conditions: {
          source: {
            key: 'attached',
            trigger: 'active'
          }
        },
        actions: [{
          applyStatusEffect: {
            targets: 'target',
            statusEffect: {
              stats: {
                goldReward
              },
            }
          }
        }],
        vars: {
          goldReward
        }
      }]
    },
    orbs: 3 + level * 7,
  }
}