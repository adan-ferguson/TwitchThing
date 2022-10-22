import { parseStatVal } from './statValueFns.js'
import { minMax } from '../utilFunctions.js'

export function scaleStats(statAffector, scalingDef, owner){
  let factor = minMax(0, owner[scalingDef.property], 1)
  if(scalingDef.inverted){
    factor = 1 - factor
  }
  const scaled = {}
  Object.entries(statAffector).forEach(([key, val]) => {
    const { isPct, value } = parseStatVal(val)
    const newValue = (isPct ? 100 : 1) * value * factor
    scaled[key] = newValue + (isPct ? '%' : '')
  })
  return scaled
}