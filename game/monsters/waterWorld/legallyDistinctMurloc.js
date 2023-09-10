export default function(){
  return {
    baseStats: {
      speed: 70,
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
                cooldownRemaining: { flat: 10000 }
              }
            }
          }]
        }]
      }
    }]
  }
}