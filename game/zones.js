const Zones = [{
  name: 'Caves',
  color: '#ebdad4',
  texture: 'caves.png',
},{
  name: 'Crypt',
  color: '#eeecec',
  texture: 'crypt.png',
},{
  name: 'Swamp',
  color: '#f5ffdf',
  texture: 'swamp.png',
},{
  name: 'Something Else',
  color: '#effaf8',
  texture: 'caves.png'
}]

// Final floor gets this bonus size
const FINAL_FLOOR_BONUS = 2
const SIZE_BASE = 10
const SIZE_PER_ZONE = 4

export default Zones

export function floorToZoneName(floor){
  return Zones[floorToZone(floor)].name
}

export function floorToZone(floor){
  return Math.floor((floor - 1) / 10)
}

export function floorSize(floor){
  const zone = Math.floor((floor - 1) / 10)
  const zoneFloor = floor - zone * 10
  const bonus = zoneFloor === 10 ? FINAL_FLOOR_BONUS : 1
  return Math.floor(bonus * (SIZE_BASE + SIZE_PER_ZONE * zone))
}