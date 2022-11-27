import { roundToNearestIntervalOf } from './utilFunctions.js'
import _ from 'lodash'

export function exponentialValue(growthPct, iterations, base = 1){
  return Math.pow(growthPct + 1, iterations) * base
}

/**
 * Thanks https://math.stackexchange.com/questions/1897059/simple-sum-of-finite-exponential-series
 * @param growthPct
 * @param iterations
 * @param base
 * @param roundToNearest
 * @returns {number}
 */
export function geometricProgession(growthPct, iterations, base = 1, roundToNearest = null){
  iterations = Math.round(iterations)
  if(iterations <= 0){
    return 0
  }
  const val =  base * (Math.pow(1 + growthPct, iterations) - 1) / growthPct
  return roundToNearest ? roundToNearestIntervalOf(val, roundToNearest) : val
}

/**
 * @param growthPct
 * @param val {number}
 * @param base
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
 * @param base
 * @return {string} Whole percentage
 */
export function exponentialPercentage(val, iterations, base = 0){
  if(_.isString(val)){
    val = parseFloat(val) / 100
  }
  if(val < 0 || val > 1){
    throw 'Exponential percentage out of range, probably a bug'
  }
  if(base < 0 || base > 1){
    throw 'Aaaaa'
  }

  return roundToNearestIntervalOf(100 * (1 - Math.pow(1 - val, iterations) * (1 - base)), 0.1) + '%'
}

export function oneTwoFive(val){
  const magnitude = Math.floor(val / 3)
  const mod = val % 3
  return Math.pow(10, magnitude) * [1, 2, 5][mod]
}