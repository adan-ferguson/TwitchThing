import { floorSize } from '../../game/zones.js'

const MIN_FLOOR_TRAVERSAL_PCT = 0.20

export function foundStairs(floor, room, pace = 'Brisk'){
  if(floor === 50){
    // TODO: remove this restriction
    return false
  }
  if(room <= 2){
    return false
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