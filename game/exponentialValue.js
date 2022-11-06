import { roundToFixed } from './utilFunctions.js'

export function exponentialValue(growthPct, iterations, base = 1){
  return Math.pow(growthPct + 1, iterations) * base
}

/**
 * Thanks https://math.stackexchange.com/questions/1897059/simple-sum-of-finite-exponential-series
 * @param growthPct
 * @param iterations
 * @param base
 * @returns {number}
 */
export function geometricProgession(growthPct, iterations, base = 1){
  iterations = Math.round(iterations)
  if(iterations <= 0){
    return 0
  }
  return base * (Math.pow(1 + growthPct, iterations) - 1) / growthPct
}

/**
 * @param growthPct
 * @param val {number}
 */
export function inverseGeometricProgression(growthPct, val, base = 1){
  return Math.log(val * growthPct / base + 1) / Math.log(1 + growthPct)
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