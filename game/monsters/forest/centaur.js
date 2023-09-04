export default function(){
  return {
    baseStats: {
      speed: -10,
      hpMax: '+40%',
      physDef: '20%'
    },
    items: [{
      name: 'Ride Down',
      effect: {
        abilities: [{
          trigger: 'active',
          cooldown: 10000,
          actions: [{
            attack: {
              scaling: {
                physPower: 1.4
              }
            }
          }]
        }]
      }
    }]
  }
}