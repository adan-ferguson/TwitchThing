const Zones = [{
  name: 'Caves',
  color: '#fff0e9'
},{
  name: 'Crypt',
  color: '#eeecec'
},{
  name: 'Swamp',
  color: '#f1f5e8'
},{
  name: 'Something Else',
  color: '#effaf8'
}]

export default Zones

export function floorToZoneName(floor){
  return Zones[floorToZone(floor)].name
}

export function floorToZone(floor){
  return Math.floor((floor - 1) / 10)
}