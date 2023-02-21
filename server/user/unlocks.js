import Zones, { floorToZone } from '../../game/zones.js'
import Users from '../collections/users.js'

export function checkForUnlocks(userDoc){

  const zone = floorToZone(userDoc.accomplishments.deepestFloor)
  const popups = []

  if(!userDoc.features.shop && zone >= 1){
    userDoc.features.shop = 1
    popups.push(zoneCleared(0, {
      message: 'Shop unlocked, visit it from the main page, or from the gold counter in the header.',
      items: {
        gold: 100,
        zone: 'Woods'
      }
    }))
  }

  if(!userDoc.features.workshop && zone >= 2){
    userDoc.inventory.scrap += 50
    userDoc.features.workshop = 1
    popups.push(zoneCleared(1, {
      message: 'Forge unlocked, visit it from the main page, or from the scrap counter in the header.',
      items: {
        scrap: 50,
        zone: 'Crypt'
      }
    }))
  }

  if(!userDoc.features.advClasses.rogue && zone >= 3){
    userDoc.features.advClasses.rogue = 1
    popups.push(zoneCleared(2, {
      items: {
        class: 'rogue',
        zone: 'Swamp'
      }
    }))
  }

  if(!userDoc.features.advClasses.rogue && zone >= 4){
    userDoc.inventory.scrap += 100
    userDoc.inventory.gold += 1000
    popups.push(zoneCleared(3, {
      message: 'Here, have some stuff',
      items: { scrap: 100, gold: 1000, zone: 'Water World' }
    }))
  }

  if(!userDoc.features.advClasses.rogue && zone >= 5){
    popups.push(zoneCleared(4, {
      message: 'You\'ve reached the end of the dungeon for now. Try the bonus floor 51 for wacky fun time wow!',
      zone: 'SUPER Zone'
    }))
  }

  if(popups.length){
    Users.save(userDoc)
  }

  return popups

  function zoneCleared(zoneNumber, items){
    return {
      title: `${Zones[zoneNumber].name} Cleared`,
      ...items
    }
  }
}