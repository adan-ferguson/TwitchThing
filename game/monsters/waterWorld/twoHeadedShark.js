import { biteMonsterItem } from '../../commonMechanics/biteMonsterItem.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: toPct(0.3 + tier * 0.8),
      physPower: toPct(0.1 + tier * 0.6),
      speed: 30 + tier * 100
    },
    displayName: 'Two-Headed Shark',
    items: [
      biteMonsterItem(5000, 1.6, {
        cooldown: 15000
      }), {
        ...biteMonsterItem(10000, 1.6, {
          cooldown: 15000,
        }),
        name: 'Bite Again'
      }
    ]
  }
}