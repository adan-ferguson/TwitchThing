export function biteMonsterItem(initialCooldown, physPower, def = {}){
  return {
    name: 'Bite',
    effect: {
      abilities: [{
        trigger: 'active',
        initialCooldown,
        ...def,
        actions: [{
          attack: {
            scaling: {
              physPower
            },
            lifesteal: 0.5
          }
        }]
      }]
    }
  }
}