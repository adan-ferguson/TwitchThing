import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      physPower: toPct(0.1 + 0.3 * tier),
      speed: 20 + tier * 30,
      hpMax: toPct(0.1 + 0.2 * tier),
      magicDef: toPct(0.3 + tier * 0.3)
    }
  }
}