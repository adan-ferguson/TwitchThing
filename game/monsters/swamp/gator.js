import { biteMonsterItem } from '../../commonMechanics/biteMonsterItem.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      physPower: '+40%',
      speed: -40 + tier * 50,
      hpMax: '+40%',
      magicDef: toPct(0.4 + tier * 0.4),
    },
    items: [
      biteMonsterItem(11000, 1.2)
    ]
  }
}