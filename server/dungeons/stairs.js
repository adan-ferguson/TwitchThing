import { floorSize } from '../../game/zones.js'

const BRISK_STAIRS_TIME = 0.5

export function foundStairs(dungeonRun){
  const floor = dungeonRun.floor
  const room = dungeonRun.room
  const pace = dungeonRun.pace ?? 'Brisk'

  if(room <= 2){
    return false
  }

  if(floor === 1 && room === 4){
    // Tutorial purposes
    return true
  }

  const size = floorSize(floor)
  const factor = pace === 'Leisurely' ? 1 : BRISK_STAIRS_TIME
  return room >= size * factor
}