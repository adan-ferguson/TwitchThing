import scaledValue from '../../game/scaledValue.js'

const SIZE_BASE = 12
const SCALE_PER_FLOOR = 0.07
const SCALE_PER_ZONE = 0.25
const MIN_FLOOR_TRAVERSAL_PCT = 0.30

// Final floor gets this bonus size
const FINAL_FLOOR_BONUS = 4.0

export function foundStairs(floor, room, pace = 'Brisk'){
  if(floor === 30){
    // TODO: remove this restriction
    return false
  }
  if(room <= 2){
    return false
  }
  let size = floorSize(floor, SIZE_BASE, SCALE_PER_FLOOR, SCALE_PER_ZONE, FINAL_FLOOR_BONUS)
  if(pace === 'Leisurely'){
    return room >= size
  }

  const minTraversal = Math.floor(size * MIN_FLOOR_TRAVERSAL_PCT)
  const fraction = 1 / (size - minTraversal)
  const stairsChance = Math.max(0, Math.min(1, fraction * (room - minTraversal)))
  console.log('chance', stairsChance)
  return Math.random() < stairsChance
}

export function floorSize(floor, base, scalePerFloor = 0, scalePerZone = 0, finalBonus = 1){
  const zone = Math.floor((floor - 1) / 10)
  const zoneFloor = floor - zone * 10
  const bonus = zoneFloor === 10 ? finalBonus : 1
  const floorBase = scaledValue(scalePerFloor, zoneFloor - 1, base)
  return Math.floor(bonus * scaledValue(scalePerZone, zone, floorBase))
}