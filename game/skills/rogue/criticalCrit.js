import { roundToFixed } from '../../utilFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        critChance: roundToFixed(1 / (1 + level * 0.5)) + 'x',
        critDamage: (1 + level) + 'x',
      }
    }
  }
}