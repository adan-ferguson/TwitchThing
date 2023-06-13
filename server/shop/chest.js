import { applyChestToUser, generateRandomChest } from '../dungeons/chests.js'

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
    classes: [chestData.className],
    level: chestData.level,
    type: 'shop'
  })
  applyChestToUser(userDoc, chest)
  return chest
}

async function countPurchases(purchases){
  const byType = {}
  purchases.forEach(purchase => {
    if(purchase.shopItem?.type !== 'chest'){
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
  const level = Math.min(100, 10 + purchaseCount * 10)
  return {
    type: 'chest',
    id: className + 'Chest',
    price: {
      gold: toPrice(level)
    },
    data: {
      level,
      className
    }
  }
}

function toPrice(level){
  return level * 10
}