import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      speed: 40 + tier * 60,
      hpMax: '-30%',
      physPower: toPct(-0.1 + tier * 0.7)
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
                      duration: 15000 + tier * 5000,
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