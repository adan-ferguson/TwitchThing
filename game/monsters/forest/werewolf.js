export default function(){
  return {
    baseStats: {
      hpMax: '+15%',
      physPower: '-20%'
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
                    speed: 25
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