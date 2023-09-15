import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      speed: -20,
      physDef: toPct(tier ? 0.8 : 0.3),
      hpMax: toPct(tier ? 4 : 0.4),
    }
  }
}