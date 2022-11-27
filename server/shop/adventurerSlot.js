const BASE_PRICE = 100

export function adventurerSlotShopItem(slotIndex){
  const price = Math.pow(BASE_PRICE, slotIndex)
  return {
    id: 'adventurerSlot',
    type: 'adventurerSlot',
    price: {
      gold: price
    }
  }
}