import { roundToFixed } from '../../utilFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        hpMax: roundToFixed(Math.pow(0.9, level), 2) + 'x',
        speed: 10 + level * 10
      }
    },
    orbs: level + 1
  }
}