export default function(level){
  const amount = 2000 + level * 2000
  return {
    effect: {
      abilities: [{
        trigger: 'startOfCombat',
        actions: [{
          modifyAbility: {
            targets: 'self',
            trigger: 'active',
            modification: {
              cooldownRemaining: -amount
            }
          }
        }]
      }]
    },
  }
}