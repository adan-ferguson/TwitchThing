const BASE_PRICE = 100
const SCRAP_BASE_AMOUNT = 20

const XP_BASE = 25
const XP_GROWTH = 25

export function scrapShopItem(userDoc){
  if(!userDoc.features.workshop){
    return null
  }
  return {
    type: 'scrap',
    id: 'scrap',
    scalable: true,
    price: {
      gold: BASE_PRICE
    },
    data: {
      scrap: SCRAP_BASE_AMOUNT
    }
  }
}

export function xpShopItem(userDoc, purchases){
  const amount = purchases.reduce((current, purchase) => {
    return current + (purchase.shopItem.type === 'stashedXp' ? purchase.count : 0)
  }, 0)
  return {
    type: 'stashedXp',
    id: 'stashedXp',
    scalable: true,
    price: {
      gold: 100
    },
    data: {
      stashedXp: {
        base: XP_BASE + amount * XP_GROWTH,
        growth: XP_GROWTH
      }
    }
  }
}