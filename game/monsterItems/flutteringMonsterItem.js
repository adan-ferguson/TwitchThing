export default {
  name: 'Fluttering',
  effect: {
    abilities: {
      replacement: {
        attacked: {
          cooldown: 10000,
          dataMerge: {
            forceDodge: true
          }
        }
      }
    }
  }
}