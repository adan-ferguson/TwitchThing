import Purchases from '../collections/purchases.js'
import { applyChestToUser, generateRandomChest } from '../dungeons/chests.js'

const CHEST_BASE_PRICE = 250
// const PRICE_GROWTH = 250
// const PRICE_GROWTH_RATE = 0.2

export async function chestShopItems(userDoc){
  const purchases = await countPurchases(userDoc._id)

  const chests = []

  Object.keys(userDoc.features.advClasses).forEach(className => {
    chests.push(chestDef(className, purchases[className] ?? 0))
  })

  return chests
}

export async function shopChestPurchased(userDoc, chestData){
  const chest = generateRandomChest({
    class: chestData.class,
    level: chestData.level,
    type: 'shop'
  })
  applyChestToUser(userDoc, chest)
  return chest
}

async function countPurchases(userID){
  const purchases = await Purchases.find({
    query: {
      userID
    }
  })
  const byType = {}
  purchases.forEach(purchase => {
    const type = purchase.purchased.data?.type
    if(!type){
      return
    }
    if(!byType[type]){
      byType[type] = 0
    }
    byType[type]++
  })
  return byType
}

function chestDef(className, purchaseCount){
  return {
    type: 'chest',
    id: className + 'Chest',
    price: {
      gold: toPrice(purchaseCount)
    },
    data: {
      level: Math.min(50, 10 + purchaseCount * 5),
      className
    }
  }
}

function toPrice(purchaseCount){
  return CHEST_BASE_PRICE * (purchaseCount + 1)
}