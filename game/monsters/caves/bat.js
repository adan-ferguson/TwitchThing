import flutteringMonsterItem from '../../commonMechanics/flutteringMonsterItem.js'
import { fillArray, toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      speed: 30 + tier * 30,
      hpMax: toPct(-0.4 - tier * 0.2),
      physPower: toPct(-0.3 - tier * 0.2),
    },
    items: fillArray(() => flutteringMonsterItem, 1 + tier * 2)
  }
}