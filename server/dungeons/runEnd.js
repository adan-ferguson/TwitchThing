import { floorToZoneName } from '../../game/zones.js'

export function runEnd(dungeonRun){
  const floor = dungeonRun.floor
  if(!floor % 10 > 0){
    return null
  }
  if(floor >= dungeonRun.user.accomplishments.deepestFloor){
    const zone = floorToZoneName(floor)
    return {
      runFinished: true,
      roomType: 'cleared',
      message: `${dungeonRun.adventurerInstance.displayName} returns triumphantly after clearing the ${zone}.`
    }
  }
  // if(floor === 50){
  //   return {
  //     runFinished: true,
  //     roomType: 'outoforder',
  //     floor: floor + 1,
  //     room: 0,
  //     message: `${dungeonRun.adventurerInstance.displayname} finds that the stairs to the next zone are out of order, what a rip off!`
  //   }
  // }
  return false
}