const ZONES = [
  'Caves',
  'Crypt'
]

export default ZONES

export function zoneNameFromFloor(floor){
  return ZONES[Math.floor((floor - 1) / 10)]
}