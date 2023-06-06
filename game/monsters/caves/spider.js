export default function(){
  return {
    baseStats: {
      physPower: '+20%',
      hpMax: '+30%',
      speed: 10
    },
    items: [
      {
        name: 'Web Shot',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 9000,
            actions: [{
              applyStatusEffect: {
                targets: 'enemy',
                statusEffect: {
                  name: 'webbed',
                  stacking: 'stack',
                  persisting: true,
                  duration: 10000,
                  polarity: 'debuff',
                  stats: {
                    speed: -35
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