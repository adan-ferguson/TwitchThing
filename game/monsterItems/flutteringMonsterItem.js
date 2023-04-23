export default {
  name: 'fluttering',
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