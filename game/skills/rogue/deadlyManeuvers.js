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
                total: 0.85 * Math.pow(0.92, level - 1),
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