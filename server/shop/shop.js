import { adventurerSlotShopItem } from './adventurerSlot.js'
import { chestShopItems, shopChestPurchased } from './chest.js'
import Users from '../collections/users.js'
import Purchases from '../collections/purchases.js'
import { spendGold } from '../user/inventory.js'
import { scrapShopItem, xpShopItem } from './misc.js'
import { arithmeticSum } from '../../game/growthFunctions.js'

export async function getUserShop(userDoc){
  const purchases = await Purchases.find({
    query: {
      userID: userDoc._id
    }
  })
  const items = []
  items.push(adventurerSlotShopItem(userDoc.inventory.adventurerSlots))
  items.push(xpShopItem(userDoc, purchases))
  items.push(scrapShopItem(userDoc))
  items.push(...chestShopItems(userDoc, purchases))
  return items.filter(i => i)
}

export async function buyShopItem(userDoc, shopItemId, count){
  const userShop = await getUserShop(userDoc)
  const shopItem = userShop.find(shopItem => shopItem.id === shopItemId)
  if(!shopItem){
    throw { message: 'Invalid shopItemId' }
  }
  if(count > 1 && !shopItem.scalable){
    throw { message: 'Can not multibuy this item' }
  }

  spendGold(userDoc, shopItem.price.gold * count)

  let returnValue = {}
  if(shopItem.type === 'adventurerSlot'){
    userDoc.inventory.adventurerSlots++
    returnValue.message = 'Adventurer Slot purchased successfully.'
  }else if(shopItem.type === 'chest'){
    returnValue.chests = await shopChestPurchased(userDoc, shopItem.data, count)
  }else if(shopItem.type === 'scrap'){
    userDoc.inventory.scrap += shopItem.data.scrap * count
    returnValue.message = 'Scrap purchased successfully.'
  }else if(shopItem.type === 'stashedXp'){
    userDoc.inventory.stashedXp += arithmeticSum(shopItem.data.stashedXp.base, shopItem.data.stashedXp.growth, count)
    returnValue.message = 'Stashed XP purchased successfully.'
  }

  await Purchases.save({
    userID: userDoc._id,
    timestamp: Date.now(),
    shopItem,
    count
  })
  await Users.saveAndEmit(userDoc)
  return returnValue
}