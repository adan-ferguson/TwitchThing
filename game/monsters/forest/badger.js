import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      physPower: toPct(0.1 + tier * 0.3),
      hpMax: toPct(-0.1 + tier * 0.6),
      speed: 40 + tier * 40
    }
  }
}