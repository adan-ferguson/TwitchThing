export default function(tier){
  return {
    baseStats: {
      speed: 70 + tier * 80,
    },
    items: [{
      name: 'Gargle Gibberish',
      effect: {
        abilities: [{
          trigger: 'active',
          uses: 1,
          actions: [{
            modifyAbility: {
              targets: 'enemy',
              trigger: 'active',
              modification: {
                cooldownRemaining: { flat: 10000 + tier * 10000 }
              }
            }
          }]
        }]
      }
    }]
  }
}