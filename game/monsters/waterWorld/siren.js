export default function(){
  return {
    baseStats: {
      speed: 40,
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
                      duration: 15000
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