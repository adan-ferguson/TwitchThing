export default function(level){
  const amount = level * 10000
  return {
    effect: {
      abilities: [{
        trigger: { rest: true },
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
    orbs: 3 + level * 1
  }
}