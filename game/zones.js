const ZONES = [
  'Caves',
  'Crypt'
]

export default ZONES

export function floorToZoneName(floor){
  return ZONES[floorToZone(floor)]
}

export function floorToZone(floor){
  return Math.floor((floor - 1) / 10)
}