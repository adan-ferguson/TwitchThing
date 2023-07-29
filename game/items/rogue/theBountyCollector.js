export default function(level){
  const value = level * 5
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
    orbs: 5 + level * 5,
  }
}