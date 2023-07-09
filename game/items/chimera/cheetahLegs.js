import { roundToFixed } from '../../utilFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        hpMax: roundToFixed(0.9 * Math.pow(0.95, level - 1), 2) + 'x',
        speed: 10 + level * 20
      }
    },
    orbs: level + 1
  }
}