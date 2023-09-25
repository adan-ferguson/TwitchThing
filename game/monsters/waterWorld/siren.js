export default function(tier){
  return {
    baseStats: {
      speed: 40 + tier * 60,
      hpMax: '-30%',
      physPower: '-10%'
    },
    items: [
      {
        name: 'Charm',
        effect: {
          abilities: [{
            trigger: 'active',
            uses: 1,
            actions: [{
              applyStatusEffect: {
                targets: 'enemy',
                statusEffect: {
                  base: {
                    charmed: {
                      duration: 15000 + tier * 15000,
                    }
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