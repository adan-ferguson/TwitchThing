export default {
  displayName: 'Punch',
  levelFn: level => {
    return {
      slotModifier: [{ slot: 'attached', restriction: 'empty' }]
    }
  }
}