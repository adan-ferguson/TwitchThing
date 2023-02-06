const BASE_PRICE = 1000
const BASE_AMOUNT = 70

export async function scrapShopItem(userDoc, purchases){
  // const scrapPurchases = purchases.filter(purchase => purchase.type === 'scrap').length
  return {
    type: 'scrap',
    id: 'scrap',
    price: {
      gold: BASE_PRICE  // * (scrapPurchases + 1)
    },
    data: {
      scrap: BASE_AMOUNT // * (scrapPurchases + 1)
    }
  }
}