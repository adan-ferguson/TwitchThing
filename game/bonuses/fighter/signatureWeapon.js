export default {
  effect: level => {
    const reduction = level * -2
    return {
      slotEffect: {
        slotTag: 'signatureWeapon',
        orbs: {
          fighter: reduction
        }
      },
      description: `Your Signature Weapon costs [Ofighter${reduction}].`,
    }
  },
  slotBonus: {
    slotIndex: 0, // TODO: not hardcoded
    tags: ['signatureWeapon'],
    description: 'Your 1st item slot becomes your Signature Weapon.'
    // displayName: 'Signature Weapon',
  },
  rarity: 1,
  minOrbs: 5
}