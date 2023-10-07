import { roundToFixed } from '../../utilFunctions.js'

export default function(level){
  const val = level + 1
  return {
    effect: {
      stats: {
        cooldownMultiplier: roundToFixed(0.5 + val / 2, 1) + 'x',
        magicPower: val + 'x'
      }
    }
  }
}