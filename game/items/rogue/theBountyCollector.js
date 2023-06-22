export default function(level){
  const value = 2 + level * 3
  return {
    effect: {
      abilities: [{
        trigger: 'kill',
        conditions: {
          source: {
            subjectKey: 'attached',
            trigger: 'active'
          }
        },
        actions: [{
          theBountyCollectorKill: {
            value
          }
        }]
      }]
    },
    orbs: 6 + level * 4,
  }
}