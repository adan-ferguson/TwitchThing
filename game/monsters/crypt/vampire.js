export default function(){
  return {
    baseStats: {
      speed: 20,
      physPower: '+10%',
      hpMax: '-10%'
    },
    items: [
      {
        name: 'Lifesteal',
        effect: {
          stats: {
            lifesteal: 0.33
          }
        }
      }
    ]
  }
}