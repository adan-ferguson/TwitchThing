export default function(level){
  const amount = 5000 + level * 5000
  return {
    effect: {
      stats: {
        startingFood: level
      },
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
    orbs: 2 + level * 1,
    displayName: 'Mana Biscuits',
  }
}