import { toPct } from '../../utilFunctions.js'

export default function(tier){
  const hpScaling = 2 + tier * 3
  return {
    baseStats: {
      speed: -150 + tier * 50,
      hpMax: toPct(-0.5 + tier * 0.2),
    },
    items: [
      {
        name: 'Explode!',
        effect: {
          abilities: [{
            trigger: 'active',
            abilityId: 'explode',
            actions: [
              {
                explode: {
                  scaling: {
                    hp: hpScaling
                  }
                }
              }
            ]
          }]
        }
      }
    ]
  }
}
