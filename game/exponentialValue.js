import { roundToFixed } from './utilFunctions.js'

export function exponentialValue(growthPct, iterations, base = 1){
  return Math.pow(growthPct + 1, iterations) * base
}

export function exponentialValueCumulative(growthPct, iterations, base = 1){
  let total = 0
  for(let i = 0; i < iterations; i++){
    total += base * Math.pow(growthPct + 1, i)
  }
  return total
}

/**
 * Common thing
 * 20%, 1 => 20%
 * 20%, 2 => 36%
 * @param val {number|string} 0 to 100
 * @param iterations {number} natural number
 * @return {string} Whole percentage
 */
export function exponentialPercentage(val, iterations){
  val = parseFloat(val) / 100
  return 100 * (1 - roundToFixed(Math.pow(1 - val, iterations), 2)) + '%'
}