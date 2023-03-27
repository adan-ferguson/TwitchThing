export function adjustInventoryBasics(userDoc, diff, inverted = false){
  const invBasics = userDoc.inventory.items.basic
  const invInt = inverted ? -1 : 1
  for(let baseItemId in diff){
    invBasics[baseItemId] = (invBasics[baseItemId] ?? 0) + diff[baseItemId] * invInt
    if(invBasics[baseItemId] < 0){
      throw `Not enough of basic item: ${baseItemId}`
    }
  }
  for(let baseItemId in invBasics){
    if(invBasics[baseItemId] === 0){
      delete invBasics[baseItemId]
    }
  }
}

export function adjustInventoryCrafted(userDoc, added, removed){
  const obj = userDoc.inventory.items.crafted
  added.forEach(itemDef => {
    obj[itemDef.id] = itemDef
  })
  removed.forEach(itemDef => {
    delete obj[itemDef.id]
  })
}

export function spendInventoryBasics(userDoc, baseItemId, count){
  adjustInventoryBasics(userDoc, {
    [baseItemId]: -count
  })
}


/**
 * Non-saving. Do this before granting the effect, because this will throw
 * if user doesn't have enough gold.
 */
export function spendGold(doc, price){
  if(price > doc.inventory.gold){
    throw { message: 'Not enough gold for transaction' }
  }
  doc.inventory.gold -= price
}

export function spendScrap(doc, price){
  if(price > doc.inventory.scrap){
    throw { message: 'Not enough scrap for transaction' }
  }
  doc.inventory.scrap -= price
}