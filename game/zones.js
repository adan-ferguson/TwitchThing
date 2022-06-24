const Zones = [{
  name: 'Caves'
},{
  name: 'Crypt'
}]

export default Zones

export function floorToZoneName(floor){
  return Zones[floorToZone(floor)].name
}

export function floorToZone(floor){
  return Math.floor((floor - 1) / 10)
}