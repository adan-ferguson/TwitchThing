import { applyChestToUser, generateRandomChest } from '../dungeons/chests.js'

const CHEST_BASE_PRICE = 100
// const PRICE_GROWTH = 250
// const PRICE_GROWTH_RATE = 0.2

export async function chestShopItems(userDoc, purchases){
  const purchasesByClass = await countPurchases(purchases)

  const chests = []

  Object.keys(userDoc.features.advClasses).forEach(className => {
    if(userDoc.features.advClasses[className]){
      chests.push(chestDef(className, purchasesByClass[className] ?? 0))
    }
  })

  return chests
}

export async function shopChestPurchased(userDoc, chestData){
  const chest = generateRandomChest({
    class: chestData.className,
    level: chestData.level,
    type: 'shop'
  })
  applyChestToUser(userDoc, chest)
  return chest
}

async function countPurchases(purchases){
  const byType = {}
  purchases.forEach(purchase => {
    if(purchase.shopItem.type !== 'chest'){
      return
    }
    const type = purchase.shopItem.data.className
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