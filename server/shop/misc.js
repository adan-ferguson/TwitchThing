const BASE_PRICE = 100
const BASE_AMOUNT = 15

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
      scrap: BASE_AMOUNT
    }
  }
}

export function xpShopItem(){
  return {
    type: 'stashedXp',
    id: 'stashedXp',
    scalable: true,
    price: {
      gold: 100
    },
    data: {
      stashedXp: 250
    }
  }
}