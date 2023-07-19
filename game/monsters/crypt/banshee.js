export default function(){
  return {
    baseStats: {
      physPower: '-20%',
      hpMax: '-20%'
    },
    items: [
      {
        name: 'Wail',
        effect: {
          abilities: [{
            trigger: 'active',
            uses: 1,
            actions: [{
              bansheeWail: {},
            }]
          }]
        }
      },
      {
        name: 'Incorporeal',
        effect: {
          stats: {
            damageCeiling: 1/3
          }
        }
      }
    ]
  }
}