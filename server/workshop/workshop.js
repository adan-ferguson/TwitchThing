import Adventurers from '../collections/adventurers.js'
import { adjustInventoryBasics, spendInventoryBasics, spendScrap } from '../loadouts/inventory.js'
import Users from '../collections/users.js'
import AdventurerItemInstance from '../../game/adventurerItemInstance.js'

export async function getUserWorkshop(userDoc){
  return {
    inventory: userDoc.inventory,
    adventurers: await Adventurers.findByIDs(userDoc.adventurers)
  }
}

export async function scrapItems(userDoc, { basic, crafted }){
  adjustInventoryBasics(userDoc, basic, true)
  crafted.forEach(id => {
    if(!userDoc.inventory.items.crafted[id]){
      throw 'Item not found: ' + id
    }
    userDoc.inventory.scrap += new AdventurerItemInstance(userDoc.inventory.items.crafted[id])
    delete userDoc.inventory.items.crafted[id]
  })
  Object.keys(basic).forEach(group => {
    Object.keys(basic[group]).forEach(name => {
      userDoc.inventory.scrap += new AdventurerItemInstance({ group, name }).scrapValue * basic[group][name]
    })
  })
  await Users.saveAndEmit(userDoc)
}

export async function upgradeInventoryItem(userDoc, itemDef){
  if(itemDef.id){
    // Crafted
    itemDef = userDoc.inventory.items.crafted[itemDef.id]
  }else{
    // Basic
    spendInventoryBasics(userDoc, itemDef.group, itemDef.name, 1)
  }
  const upgradedItemDef = upgradeItem(userDoc, itemDef)
  userDoc.inventory.items.crafted[upgradedItemDef.id] = upgradedItemDef
  await Users.saveAndEmit(userDoc)
}

export async function upgradeAdventurerItem(userDoc, slotIndex, adventurerID){
  const advDoc = Adventurers.findByID(adventurerID)
  if(!advDoc.userID.equals(userDoc._id)){
    throw 'User does not own the item.'
  }
  const itemDef = advDoc.items[slotIndex]
  if(!itemDef){
    throw 'Could not find item.'
  }
  advDoc.items[slotIndex] = upgradeItem(userDoc, itemDef)
  await Adventurers.save(advDoc)
  await Users.saveAndEmit(userDoc)
}

async function upgradeItem(userDoc, itemDef){
  const aii = new AdventurerItemInstance(itemDef)
  const upgradeInfo = aii.upgradeInfo()

  upgradeInfo.components.forEach(component => {
    if(component.type === 'scrap'){
      spendScrap(component.count)
    }else if(component.type === 'item'){
      spendInventoryBasics(userDoc, component.group, component.name, component.count)
    }
  })

  return upgradeInfo.upgradedItemDef
}