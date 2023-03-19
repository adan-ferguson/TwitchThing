export default {
  displayName: 'Signature Weapon',
  levelFn: level => {
    return {
      loadoutModifiers: [{ slot: 'attached', orbs: -3 }]
    }
  }
}