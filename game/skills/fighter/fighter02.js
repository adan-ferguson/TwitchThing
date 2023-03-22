export default {
  levelFn(level){
    const orbs = -1 - level * 2
    return {
      displayName: 'Signature Weapon',
      loadoutModifiers: [{ slot: 'attached', orbs }],
      vals: { orbs }
    }
  }
}