export default function(){
  return {
    baseStats: {
      speed: 5,
      hpMax: '-20%',
      physPower: '+10%'
    },
    items: [
      {
        name: 'Ambush',
        effect: {
          mods: [{
            sneakAttack: true
          }]
        }
      }
    ]
  }
}