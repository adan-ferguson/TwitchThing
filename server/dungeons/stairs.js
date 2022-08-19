import scaledValue from '../../game/scaledValue.js'

const SIZE_BASE = 10
const SCALE_PER_FLOOR = 0.07
const SCALE_PER_ZONE = 0.25

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
  const evenSize = size % 2 ? size + 1 : size
  const diff = room - evenSize / 2
  if(diff <= 0){
    return false
  }
  const stairsChance = 1 / Math.max(1, evenSize / 2 - diff + 1)
  return Math.random() < stairsChance
}

export function floorSize(floor, base, scalePerFloor = 0, scalePerZone = 0, finalBonus = 1){
  const zone = Math.floor((floor - 1) / 10)
  const zoneFloor = floor - zone * 10
  const bonus = zoneFloor === 10 ? finalBonus : 1
  const floorBase = scaledValue(scalePerFloor, zoneFloor - 1, base)
  return Math.floor(bonus * scaledValue(scalePerZone, zone, floorBase))
}