export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'crit',
        actions: [{
          modifyAbility: {
            targets: 'self',
            trigger: 'active',
            modification: {
              cooldownRemaining: {
                total: 0.8 * Math.pow(0.9, level - 1),
              }
            }
          }
        }]
      }],
      stats: {
        critChance: 0.05 + 0.05 * level
      }
    },
  }
}