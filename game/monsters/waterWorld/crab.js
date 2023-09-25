import tastyMonsterItem from '../../commonMechanics/tastyMonsterItem.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      physDef: toPct(tier ? 0.9 : 0.5),
      speed: 10
    },
    items: [
      {
        name: 'Double Pinch',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 7000 - tier * 3000,
            actions: [{
              attack: {
                hits: 2,
                scaling: {
                  physPower: 1
                }
              }
            }]
          }]
        }
      },
      tastyMonsterItem
    ]
  }
}