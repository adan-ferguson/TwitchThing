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
  if(floor === 60){
    return {
      runFinished: true,
      roomType: 'outOfOrder',
      message: `${dungeonRun.adventurerInstance.displayName} finds that the stairs to the next zone are out of order, what a rip off!`
    }
  }
  return false
}