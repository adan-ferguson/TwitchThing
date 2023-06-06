export default function(){
  return {
    baseStats: {
      hpMax: '+20%',
      physPower: '-10%'
    },
    items: [
      {
        name: 'Frenzy',
        effect: {
          abilities: [{
            trigger: 'attackHit',
            actions: [{
              applyStatusEffect: {
                targets: 'self',
                statusEffect: {
                  name: 'frenzy',
                  polarity: 'buff',
                  stacking: 'stack',
                  stats: {
                    speed: 30
                  }
                }
              }
            }]
          }]
        }
      }
    ]
  }
}