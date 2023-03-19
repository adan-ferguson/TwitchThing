export default {
  levelFn: level => {
    return {
      displayName: 'Punch',
      loadoutModifiers: [{ slot: 'attached', restriction: 'empty' }]
    }
  }
}