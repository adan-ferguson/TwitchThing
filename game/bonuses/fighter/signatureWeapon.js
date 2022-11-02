export default {
  effect: level => {
    const reduction = level * -2
    return {
      slotEffect: {
        slotIndex: 0,
        orbs: {
          fighter: reduction
        }
      },
      description: `Slot #1 becomes your Signature Weapon slot. The item there costs [Ofighter${reduction}].`
    }
  },
  rarity: 1
}