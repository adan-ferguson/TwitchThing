export default function(){
  return {
    baseStats: {
      speed: 20,
      hpMax: '-10%',
      magicDef: '40%'
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