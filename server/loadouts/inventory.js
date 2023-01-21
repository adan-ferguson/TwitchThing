export function adjustInventoryBasics(userDoc, diff, inverted = false){
  const invBasics = userDoc.inventory.items.basic
  const invInt = inverted ? -1 : 1
  for(let group in diff){
    for(let name in diff[group]){
      if(!invBasics[group]){
        invBasics[group] = {}
      }
      if(!invBasics[group][name]){
        invBasics[group][name] = 0
      }
      invBasics[group][name] += diff[group][name] * invInt
      if(invBasics[group][name] < 0){
        throw `Not enough of basic item: ${group} - ${name}`
      }
    }
  }
  for(let group in invBasics){
    for(let name in invBasics[group]){
      if(invBasics[group][name] === 0){
        delete invBasics[group][name]
      }
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

export function spendInventoryBasics(userDoc, group, name, count){
  adjustInventoryBasics(userDoc, {
    [group]: {
      [name]: -count
    }
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