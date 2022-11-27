import { adventurerSlotShopItem } from './adventurerSlot.js'
import { chestShopItems } from './chest.js'

export async function getUserShop(userDoc){
  const items = []
  items.push(adventurerSlotShopItem(userDoc.inventory.adventurerSlots))
  items.push(...await chestShopItems(userDoc))
  return items
}