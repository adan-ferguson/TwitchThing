export default function(){
  return {
    baseStats: {
      hpMax: '+10%',
      physPower: '-25%'
    },
    items: [
      {
        name: 'Frenzy',
        effect: {
          abilities: [{
            trigger: { attackHit: true },
            actions: [{
              applyStatusEffect: {
                target: 'self',
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