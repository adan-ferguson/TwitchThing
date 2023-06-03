import { floorSize } from '../../game/zones.js'

const MIN_FLOOR_TRAVERSAL_PCT = 0.5

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
  if(pace === 'Leisurely'){
    return room >= size
  }

  const minTraversal = Math.floor(size * MIN_FLOOR_TRAVERSAL_PCT)
  const fraction = 1 / (size - minTraversal)
  const stairsChance = Math.max(0, Math.min(1, fraction * (room - minTraversal)))
  return Math.random() < stairsChance
}