import Adventurers from '../collections/adventurers.js'

export async function getUserWorkshop(userDoc){
  return {
    inventory: userDoc.inventory,
    adventurers: await Adventurers.findByIDs(userDoc.adventurers)
  }
}