import scaledValue from './scaledValue.js'

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
const FINAL_FLOOR_BONUS = 4.0
const SIZE_BASE = 12
const SCALE_PER_FLOOR = 0.07
const SCALE_PER_ZONE = 0.25

export default Zones

export function floorToZoneName(floor){
  return Zones[floorToZone(floor)].name
}

export function floorToZone(floor){
  return Math.floor((floor - 1) / 10)
}

export function floorSize(floor){
  return fs(floor, SIZE_BASE, SCALE_PER_FLOOR, SCALE_PER_ZONE, FINAL_FLOOR_BONUS)
  function fs(floor, base, scalePerFloor = 0, scalePerZone = 0, finalBonus = 1){
    const zone = Math.floor((floor - 1) / 10)
    const zoneFloor = floor - zone * 10
    const bonus = zoneFloor === 10 ? finalBonus : 1
    const floorBase = scaledValue(scalePerFloor, zoneFloor - 1, base)
    return Math.floor(bonus * scaledValue(scalePerZone, zone, floorBase))
  }
}