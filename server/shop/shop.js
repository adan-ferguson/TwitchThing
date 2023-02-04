import { adventurerSlotShopItem } from './adventurerSlot.js'
import { chestShopItems, shopChestPurchased } from './chest.js'
import Users from '../collections/users.js'
import Purchases from '../collections/purchases.js'
import { spendGold } from '../loadouts/inventory.js'

export async function getUserShop(userDoc){
  const purchases = await Purchases.find({
    query: {
      userID: userDoc._id
    }
  })
  const items = []
  items.push(adventurerSlotShopItem(userDoc.inventory.adventurerSlots))
  items.push(await scrapShopItem(userDoc, purchases))
  items.push(...await chestShopItems(userDoc, purchases))
  return items
}

export async function buyShopItem(userDoc, shopItemId){
  const userShop = await getUserShop(userDoc)
  const shopItem = userShop.find(shopItem => shopItem.id === shopItemId)
  if(!shopItem){
    throw { message: 'Invalid shopItemId' }
  }

  spendGold(userDoc, shopItem.price.gold)

  let returnValue = {}
  if(shopItem.type === 'adventurerSlot'){
    userDoc.inventory.adventurerSlots++
    returnValue.message = 'Adventurer Slot purchased successfully.'
  }else if(shopItem.type === 'chest'){
    returnValue.chest = await shopChestPurchased(userDoc, shopItem.data)
  }else if(shopItem.type === 'scrap'){
    userDoc.inventory.scrap += shopItem.data.scrap
    returnValue.message = 'Scrap purchased successfully.'
  }

  await Purchases.save({
    userID: userDoc._id,
    timestamp: Date.now(),
    shopItem
  })
  await Users.saveAndEmit(userDoc)
  return returnValue
}