import { applyChestToUser, generateRandomChest } from '../dungeons/chests.js'

export function chestShopItems(userDoc, purchases){
  const purchasesByClass = countPurchases(purchases)

  const chests = []

  Object.keys(userDoc.features.advClasses).forEach(className => {
    if(userDoc.features.advClasses[className]){
      chests.push(chestDef(className, purchasesByClass[className] ?? 0))
    }
  })

  return chests
}

export async function shopChestPurchased(userDoc, chestData, count = 1){
  if(chestData.level !== 100 && count > 1){
    throw 'Can not multi-buy chests that below max level'
  }
  const chests = []
  for(let i = 0; i < count; i++){
    const chest = generateRandomChest({
      classes: [chestData.className],
      level: chestData.level,
      type: 'shop',
      noGold: true,
      itemLimit: 10,
    })
    applyChestToUser(userDoc, chest)
    chests.push(chest)
  }
  return chests
}

function countPurchases(purchases){
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
    scalable: level === 100,
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