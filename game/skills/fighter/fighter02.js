export default {
  displayName: 'Signature Weapon',
  levelFn: level => {
    return {
      slotModifiers: [{ slot: 'attached', orbs: -3 }]
    }
  }
}