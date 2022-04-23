import scaledValue from '../../game/scaledValue.js'

// Base floor size
const SIZE_BASE = 20

// floor size = scaledValue(SIZE_SCALE_PER_ZONE, <zone number>, SIZE_BASE)
const SIZE_SCALE_PER_ZONE = 0.5

// Final floor gets this bonus size
const FINAL_FLOOR_BONUS = 2.0

export function foundStairs(floor, room, stairFind){
  if(room <= 2){
    return false
  }
  const size = floorSize(floor, SIZE_BASE, SIZE_SCALE_PER_ZONE, FINAL_FLOOR_BONUS)
  const stairsChance = 1 / Math.max(1, size - room + 1)
  return Math.random() < stairsChance * stairFind
}

export function floorSize(floor, base, scalePerZone, finalBonus){
  const zone = Math.floor((floor - 1) / 10)
  const zoneFloor = floor - zone * 10
  const bonus = zoneFloor === 10 ? finalBonus : 1
  return Math.floor(bonus * scaledValue(scalePerZone, zone, base))
}