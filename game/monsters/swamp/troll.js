import { regenerationEffect } from '../../commonMechanics/effects/regenerationEffect.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: toPct(0.4 + 0.8 * tier),
      physPower: '+10%',
      physDef: '20%',
      speed: -10 + tier * 50,
    },
    items: [
      {
        name: 'Hyper Regeneration',
        effect: regenerationEffect(0.2 + tier * 0.15)
      }
    ]
  }
}