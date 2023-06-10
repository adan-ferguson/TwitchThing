import Adventurers from '../collections/adventurers.js'
import { adjustInventoryBasics, spendInventoryBasics, spendScrap } from '../user/inventory.js'
import Users from '../collections/users.js'
import AdventurerItem from '../../game/items/adventurerItem.js'
import Craftings from '../collections/craftings.js'

export async function getUserWorkshop(userDoc){
  return {
    inventory: userDoc.inventory,
    adventurers: await Adventurers.findByIDs(userDoc.adventurers)
  }
}

export async function scrapItems(userDoc, { basic, crafted }){
  adjustInventoryBasics(userDoc, basic, true)
  crafted.forEach(id => {
    const itemDef = userDoc.inventory.items.crafted[id]
    if(!itemDef){
      throw 'Item not found: ' + id
    }
    const scrap = new AdventurerItem(itemDef).scrapValue
    userDoc.inventory.scrap += scrap
    Craftings.save({
      userID: userDoc._id,
      timestamp: Date.now(),
      type: 'scrap',
      itemDef,
      data: {
        scrap,
        baseItem: itemDef.baseItem
      }
    })
    delete userDoc.inventory.items.crafted[id]
  })
  for(let baseItemId in basic){
    const count = basic[baseItemId]
    const scrap = new AdventurerItem(baseItemId).scrapValue
    userDoc.inventory.scrap += count * scrap
    Craftings.save({
      userID: userDoc._id,
      timestamp: Date.now(),
      type: 'scrap',
      itemDef: baseItemId,
      data: {
        count,
        scrap: count * scrap,
        baseItem: baseItemId,
      }
    })
  }
  await Users.saveAndEmit(userDoc)
}

export async function upgradeInventoryItem(userDoc, itemDef){
  if(itemDef.id){
    // Crafted
    itemDef = userDoc.inventory.items.crafted[itemDef.id]
  }
  const upgradedItemDef = await upgradeItem(userDoc, itemDef)
  userDoc.inventory.items.crafted[upgradedItemDef.id] = upgradedItemDef
  await Users.saveAndEmit(userDoc)
  return upgradedItemDef
}

export async function upgradeAdventurerItem(userDoc, slotIndex, adventurerID){
  const advDoc = await Adventurers.findByID(adventurerID)
  if(!advDoc.userID.equals(userDoc._id)){
    throw 'User does not own the item.'
  }
  if(advDoc.dungeonRunID){
    throw 'Adventurer is in a dungeon run.'
  }
  const itemDef = advDoc.loadout.items[slotIndex]
  if(!itemDef){
    throw 'Could not find item.'
  }
  const upgradedItemDef = await upgradeItem(userDoc, itemDef)
  advDoc.loadout.items[slotIndex] = upgradedItemDef
  await Adventurers.save(advDoc)
  await Users.saveAndEmit(userDoc)
  return upgradedItemDef
}

async function upgradeItem(userDoc, itemDef){
  const aii = new AdventurerItem(itemDef)
  const upgradeInfo = aii.upgradeInfo()

  if(!upgradeInfo.upgradedItemDef){
    throw 'Can not upgrade item for some reason'
  }

  upgradeInfo.components.forEach(component => {
    if(component.type === 'scrap'){
      spendScrap(userDoc, component.count)
    }else if(component.type === 'item'){
      spendInventoryBasics(userDoc, component.baseItemId, component.count)
    }
  })

  await Craftings.save({
    userID: userDoc._id,
    timestamp: Date.now(),
    type: 'upgrade',
    itemDef
  })

  upgradeInfo.upgradedItemDef.createdTimestamp = Date.now()
  return upgradeInfo.upgradedItemDef
}