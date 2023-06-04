export default {
  name: 'fluttering',
  effect: {
    abilities: [{
      abilityId: 'flutteringDodge',
      trigger: 'attacked',
      conditions: {
        data: {
          undodgeable: false
        }
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