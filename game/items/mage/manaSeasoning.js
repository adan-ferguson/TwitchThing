export default function(level){
  const amount = level * 10000
  return {
    effect: {
      abilities: [{
        trigger: 'rest',
        actions:[{
          modifyAbility: {
            subjectKey: 'all',
            trigger: 'active',
            modification: {
              cooldownRemaining: -amount
            }
          }
        }]
      }]
    },
    orbs: 2 + level * 1
  }
}