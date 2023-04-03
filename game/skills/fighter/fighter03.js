export default {
  levelFn: level => {
    return {
      displayName: 'Punch',
      loadoutModifiers: {
        restrictions: {
          attached: {
            empty: true
          }
        }
      },
    }
  }
}