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

export default Zones

export function floorToZoneName(floor){
  return Zones[floorToZone(floor)].name
}

export function floorToZone(floor){
  return Math.floor((floor - 1) / 10)
}