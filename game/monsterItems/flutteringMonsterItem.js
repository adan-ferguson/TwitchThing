export default {
  name: 'fluttering',
  effect: {
    abilities: [{
      abilityId: 'flutteringDodge',
      trigger: { attacked: true },
      conditions: {
        attackDodgeable: true
      },
      cooldown: 10000,
      replacements: {
        dataMerge: {
          forceDodge: true
        }
      }
    }]
  }
}