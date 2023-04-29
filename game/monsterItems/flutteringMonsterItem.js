export default {
  name: 'fluttering',
  effect: {
    abilities: [{
      abilityId: 'flutteringDodge',
      trigger: 'attacked',
      cooldown: 10000,
      replacements: {
        dataMerge: {
          forceDodge: true
        }
      }
    }]
  }
}