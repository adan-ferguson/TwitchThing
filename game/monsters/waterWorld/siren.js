export default function(){
  return {
    baseStats: {
      speed: 30,
      hpMax: '-40%',
      physPower: '-20%'
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