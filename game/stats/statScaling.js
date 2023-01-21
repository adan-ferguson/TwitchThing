import { parseStatVal } from './statValueFns.js'
import { minMax } from '../utilFunctions.js'

export function scaleStats(statAffector, scalingDef, owner){
  let factor = minMax(0, owner[scalingDef.property], 1)
  if(scalingDef.inverted){
    factor = 1 - factor
  }
  const scaled = {}
  Object.entries(statAffector).forEach(([key, val]) => {
    const { suffix, value } = parseStatVal(val)
    scaled[key] = suffix ? value * factor + suffix : parseFloat(value * factor)
  })
  return scaled
}