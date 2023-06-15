export function biteMonsterItem(initialCooldown, physPower){
  return{
    name: 'Bite',
    effect: {
      abilities: [{
        trigger: 'active',
        initialCooldown,
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