import Purchases from '../collections/purchases.js'

const CHEST_BASE_PRICE = 200
const PRICE_GROWTH = 100
const PRICE_GROWTH_RATE = 0.2

export async function chestShopItems(userDoc){
  const purchases = countPurchases(userDoc._id)

  const chests = []

  Object.keys(userDoc.features.advClasses).forEach(className => {
    chests.push(chestDef(className, purchases[className]))
  })

  return chests
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
      class: className
    }
  }
}

function toPrice(purchaseCount){
  if(!purchaseCount){
    return CHEST_BASE_PRICE
  }
  return CHEST_BASE_PRICE + PRICE_GROWTH * Math.pow(1 + PRICE_GROWTH_RATE, purchaseCount - 1)
}