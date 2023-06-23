const Zones = [{
  name: 'Caves',
  color: '#ebdad4',
  texture: 'caves.png',
},{
  name: 'Woods',
  color: '#def5ce',
  texture: 'tree-bark.png',
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
  texture: 'little-knobs.png',
},{
  name: 'Heck',
  color: '#faa2a2',
  texture: 'little-triangles.png'
}]

// Final floor gets this bonus size
const FINAL_FLOOR_BONUS = 1 //.2
const SIZE_BASE = 10
const SIZE_PER_FLOOR = 2
const ZONE_0_REDUCTION = 1/2

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
  return Math.floor((zone === 0 ? ZONE_0_REDUCTION : 1) * bonus * (SIZE_BASE + zoneFloor * SIZE_PER_FLOOR))
}