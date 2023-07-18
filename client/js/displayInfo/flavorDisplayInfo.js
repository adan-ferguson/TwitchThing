export function flavorDisplayInfo(obj){
  return DEFS[obj.name]
}

const DEFS = {
  theBountyCollector: 'This is a knife or something actually called "The Bounty Collector", use your imagination, geez.',
  exhaustiveSearch: '100% guaranteed to crash the server somehow.',
}