export default function(level){
  const amount = level * 10000
  return {
    effect: {
      abilities: [{
        trigger: 'rest',
        actions:[{
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
    orbs: level * 1
  }
}