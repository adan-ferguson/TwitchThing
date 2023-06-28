import Zones, { floorToZone } from '../../game/zones.js'
import Users from '../collections/users.js'

export function checkForRewards(userDoc){

  const popups = []

  if(shouldRewardZoneClear(0)){
    userDoc.inventory.gold += 100
    userDoc.features.shop = 1
    popups.push(zoneCleared(0, {
      message: 'Shop unlocked, visit it from the main page, or from the gold counter in the header.',
      items: {
        gold: 100,
        zone: 'Woods'
      }
    }))
  }

  if(shouldRewardZoneClear(1)){
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

  if(shouldRewardZoneClear(2)){
    userDoc.features.advClasses.rogue = 1
    popups.push(zoneCleared(2, {
      items: {
        class: 'rogue',
        zone: 'Swamp'
      }
    }))
  }

  if(shouldRewardZoneClear(3)){
    userDoc.features.advClasses.chimera = 1
    popups.push(zoneCleared(3, {
      items: {
        class: 'chimera',
        zone: 'Water World'
      }
    }))
  }

  if(shouldRewardZoneClear(4)){
    popups.push(zoneCleared(4, {
      items: { zone: 'Heck' }
    }))
  }

  if(shouldRewardZoneClear(5)){
    popups.push(zoneCleared(5, {
      message: 'You\'ve reached the end of the dungeon for now. Try the not-fair SUPER dungeon!',
      zone: 'SUPER Dungeon'
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

  function shouldRewardZoneClear(zone){
    const should = floorToZone(userDoc.accomplishments.deepestFloor) > zone && !userDoc.rewards.zonesCleared[zone]
    if(should){
      userDoc.rewards.zonesCleared[zone] = 1
    }
    return should
  }
}