export default function(tier){
  return {
    baseStats: {
      speed: 20 + tier * 80,
      physPower: '+10%',
      hpMax: '-10%'
    },
    items: [
      {
        name: 'Lifesteal',
        effect: {
          stats: {
            lifesteal: tier ? 1 : 0.33
          }
        }
      }
    ]
  }
}