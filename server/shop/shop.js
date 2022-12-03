import { adventurerSlotShopItem } from './adventurerSlot.js'
import { chestShopItems, shopChestPurchased } from './chest.js'
import Users from '../collections/users.js'

export async function getUserShop(userDoc){
  const items = []
  items.push(adventurerSlotShopItem(userDoc.inventory.adventurerSlots))
  items.push(...await chestShopItems(userDoc))
  return items
}

export async function buyShopItem(userDoc, shopItemId){
  const userShop = await getUserShop(userDoc)
  const item = userShop.find(shopItem => shopItem.id === shopItemId)
  if(!item){
    throw { message: 'Invalid shopItemId' }
  }
  if(item.price.gold > userDoc.inventory.gold){
    throw { message: 'Can not afford shop item' }
  }

  userDoc.inventory.gold -= item.price.gold

  let returnValue = {}
  if(item.type === 'adventurerSlot'){
    userDoc.inventory.adventurerSlots++
    returnValue.message = 'Adventurer Slot purchased successfully.'
  }else if(item.type === 'chest'){
    returnValue.chest = await shopChestPurchased(userDoc, item.data)
  }

  await Users.save(userDoc)
  return returnValue
}