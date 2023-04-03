export default {
  levelFn: level => {
    return {
      displayName: 'Punch',
      loadoutModifiers: {
        attached: {
          restrictions: {
            empty: true
          }
        }
      },
    }
  }
}