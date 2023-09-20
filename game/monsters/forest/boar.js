import tastyMonsterItem from '../../commonMechanics/tastyMonsterItem.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: toPct(0.4 + tier * 1.2),
      physPower: toPct(0.2 + tier * 0.6),
      speed: 10 + tier * 40,
    },
    items: [tastyMonsterItem]
  }
}