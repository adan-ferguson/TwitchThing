export default function(){
  return {
    baseStats: {
      hpMax: '+40%',
      physPower: '+10%',
      physDef: '20%',
      speed: -10
    },
    items: [
      {
        name: 'Hyper Regeneration',
        effect: {
          abilities: [{
            trigger: 'instant',
            initialCooldown: 5000,
            actions: [{
              gainHealth: {
                scaling: {
                  hpMissing: 0.2
                }
              }
            }]
          }]
        }
      }
    ]
  }
}