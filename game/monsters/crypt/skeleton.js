import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      physDef: toPct(0.3 + (tier ? 0.5 : 0)),
      speed: -5 + tier * 40,
    }
  }
}