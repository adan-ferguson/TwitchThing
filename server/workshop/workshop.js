import Adventurers from '../collections/adventurers.js'
import { adjustInventoryBasics } from '../loadouts/inventory.js'
import Users from '../collections/users.js'
import AdventurerItemInstance from '../../game/adventurerItemInstance.js'

export async function getUserWorkshop(userDoc){
  return {
    inventory: userDoc.inventory,
    adventurers: await Adventurers.findByIDs(userDoc.adventurers)
  }
}

export async function scrapItems(userDoc, { basic, crafted }){
  adjustInventoryBasics(userDoc.inventory.items.basic, basic, true)
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