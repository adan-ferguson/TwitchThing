import { adventurerSlotShopItem } from './adventurerSlot.js'
import { chestShopItems, shopChestPurchased } from './chest.js'
import Users from '../collections/users.js'
import Purchases from '../collections/purchases.js'

export async function getUserShop(userDoc){
  const items = []
  items.push(adventurerSlotShopItem(userDoc.inventory.adventurerSlots))
  items.push(...await chestShopItems(userDoc))
  return items
}

export async function buyShopItem(userDoc, shopItemId){
  const userShop = await getUserShop(userDoc)
  const shopItem = userShop.find(shopItem => shopItem.id === shopItemId)
  if(!shopItem){
    throw { message: 'Invalid shopItemId' }
  }
  if(shopItem.price.gold > userDoc.inventory.gold){
    throw { message: 'Can not afford shop item' }
  }

  userDoc.inventory.gold -= shopItem.price.gold

  let returnValue = {}
  if(shopItem.type === 'adventurerSlot'){
    userDoc.inventory.adventurerSlots++
    returnValue.message = 'Adventurer Slot purchased successfully.'
  }else if(shopItem.type === 'chest'){
    returnValue.chest = await shopChestPurchased(userDoc, shopItem.data)
  }

  await Purchases.save({
    userID: userDoc._id,
    timestamp: Date.now(),
    shopItem
  })
  await Users.save(userDoc)
  return returnValue
}