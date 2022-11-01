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
      description: `Your top item slot becomes your main hand slot. The item there costs [Ofighter${reduction}].`
    }
  },
  rarity: 2,
  minOrbs: 5
}