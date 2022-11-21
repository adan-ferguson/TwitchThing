export default {
  effect: level => {
    const reduction = level * -1
    return {
      slotEffect: {
        slotTag: 'signatureWeapon',
        orbs: {
          fighter: reduction
        }
      },
      description: `Your 1st item slot becomes your Signature Weapon. It costs [Ofighter${-reduction}] less to equip.`,
    }
  },
  slotBonus: {
    slotIndex: 0, // TODO: not hardcoded
    tags: ['signatureWeapon'],
    // displayName: 'Signature Weapon',
  },
  rarity: 1,
  minOrbs: 1
}