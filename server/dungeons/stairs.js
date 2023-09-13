import { floorSize } from '../../game/zones.js'

const BRISK_STAIRS_TIME = 0.5

export function foundStairs(dungeonRun){
  const floor = dungeonRun.floor
  const room = dungeonRun.room
  const pace = dungeonRun.pace ?? 'Brisk'

  if(room <= 2){
    return false
  }

  const size = floor === 1 ? 8 : floorSize(dungeonRun.doc)
  const leisurelyFactor = dungeonRun.adventurerInstance.stats.get('leisurelyPaceMultiplier').value
  const factor = pace === 'Leisurely' ? leisurelyFactor : BRISK_STAIRS_TIME
  return room >= size * factor
}