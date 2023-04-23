export default {
  name: 'fluttering',
  effect: {
    abilities: [{
      name: 'flutteringDodge',
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