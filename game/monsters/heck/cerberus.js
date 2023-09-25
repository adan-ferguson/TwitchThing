import { biteMonsterItem } from '../../commonMechanics/biteMonsterItem.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: toPct(0.1 + tier * 0.3),
      physPower: toPct(0.05 + tier * 0.5),
      speed: 45
    },
    items: [
      biteMonsterItem(4000, 1.8, {
        cooldown: 16000
      }), {
        ...biteMonsterItem(8000, 1.8, {
          cooldown: 16000,
        }),
        name: 'Bite Again'
      }, {
        ...biteMonsterItem(12000, 1.8, {
          cooldown: 16000,
        }),
        name: 'Bite Yet Again'
      }
    ]
  }
}