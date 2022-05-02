import scaledValue from '../../game/scaledValue.js'

const SIZE_BASE = 12
const SCALE_PER_FLOOR = 0.08
const SCALE_PER_ZONE = 0.25

// Final floor gets this bonus size
const FINAL_FLOOR_BONUS = 3.0

export function foundStairs(floor, room, stairFind){
  if(floor === 20){
    // TODO: remove this restriction
    return false
  }
  if(room <= 2){
    return false
  }
  const size = floorSize(floor, SIZE_BASE, SCALE_PER_FLOOR, SCALE_PER_ZONE, FINAL_FLOOR_BONUS)
  const stairsChance = 1 / Math.max(1, size - room + 1)
  return Math.random() < stairsChance * stairFind
}

export function floorSize(floor, base, scalePerFloor = 0, scalePerZone = 0, finalBonus = 1){
  const zone = Math.floor((floor - 1) / 10)
  const zoneFloor = floor - zone * 10
  const bonus = zoneFloor === 10 ? finalBonus : 1
  const floorBase = scaledValue(scalePerFloor, zoneFloor - 1, base)
  return Math.floor(bonus * scaledValue(scalePerZone, zone, floorBase))
}