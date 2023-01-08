import { oneTwoFive } from '../../game/growthFunctions.js'

const FIRST_PRICE = 100
const BASE_PRICE = 1000

export function adventurerSlotShopItem(slotIndex){
  const price = slotIndex === 1 ? FIRST_PRICE : BASE_PRICE * oneTwoFive(slotIndex - 2)
  return {
    type: 'adventurerSlot',
    id: 'adventurerSlot',
    price: {
      gold: price
    }
  }
}