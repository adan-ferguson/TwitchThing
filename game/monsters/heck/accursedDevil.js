export default function(){
  return {
    baseStats: {
      hpMax: '-30%',
      speed: -10,
      physPower: '-40%',
      magicPower: '+100%'
    },
    items: [{
      name: 'TERRIBLE Curse',
      effect: {
        abilities: [{
          trigger: 'active',
          uses: 1,
          abilityId: 'terribleCurse',
          actions: [{
            terribleCurse: true
          }]
        }]
      }
    }]
  }
}