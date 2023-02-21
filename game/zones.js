const Zones = [{
  name: 'Caves',
  color: '#ebdad4',
  texture: 'caves.png',
},{
  name: 'Woods',
  color: '#def5ce',
  texture: 'crypt.png',
},{
  name: 'Crypt',
  color: '#eeecec',
  texture: 'crypt.png',
},{
  name: 'Swamp',
  color: '#dce5d8',
  texture: 'swamp.png',
},{
  name: 'Water World',
  color: '#d2e8fd',
  texture: 'crypt.png',
},{
  name: 'SUPER Zone',
  color: '#f1c4f8',
  texture: 'maze-white.png'
}]

// Final floor gets this bonus size
const FINAL_FLOOR_BONUS = 2
const SIZE_BASE = 6
const SIZE_AFTER_ZONE_0 = 4
const SIZE_PER_FLOOR = 1

export default Zones

export function floorToZoneName(floor){
  return Zones[floorToZone(floor)].name
}

export function floorToZone(floor){
  return Math.floor((floor - 1) / 10)
}

export function floorSize(floor){
  if(floor > 50){
    return 50
  }
  return 2
  // const zone = Math.floor((floor - 1) / 10)
  // const zoneFloor = floor - zone * 10
  // const bonus = zoneFloor === 10 ? FINAL_FLOOR_BONUS : 1
  // const base = SIZE_BASE + (zone > 0 ? SIZE_AFTER_ZONE_0 : 0)
  // return Math.floor(bonus * (base + zoneFloor * SIZE_PER_FLOOR))
}