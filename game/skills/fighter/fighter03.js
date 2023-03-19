export default {
  displayName: 'Punch',
  levelFn: level => {
    return {
      loadoutModifiers: [{ slot: 'attached', restriction: 'empty' }]
    }
  }
}