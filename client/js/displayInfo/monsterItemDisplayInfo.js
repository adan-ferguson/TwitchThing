export function monsterItemDisplayInfo(monsterItem){
  return monsterItemDefs[monsterItem.name] ?? {}
}

const monsterItemDefs = {
  fluttering: {
    abilityDescription: 'Automatically dodge an attack.'
  }
}