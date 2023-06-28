import { StatType } from './statType.js'
import StatDefinitions from './combined.js'
import _ from 'lodash'

const DEFAULT_DEFINITION = {
  type: StatType.COMPOSITE,
  minValue: undefined,      // derived from type if null
  maxValue: undefined,      // derived from type if null
  defaultValue: undefined,  // derived from type if not set
  roundingDecimals: 3,
  inverted: false           // If inverted, lower = better & higher = worse
}

export function makeStatObject(name, modifiers = []){
  const statDef = StatDefinitions[name]?.def
  if(!statDef){
    throw 'Unknown stat name: ' + name
  }
  let obj = {
    ...DEFAULT_DEFINITION,
    ...statDef,
    name,
    defaultValue: defaultValue(statDef)
  }
  modifiers.forEach(m => {
    obj = { ...obj, ...m }
  })
  return obj
}

function defaultValue(stat){
  if(_.isNumber(stat.defaultValue)){
    return stat.defaultValue
  }
  if(stat.type === StatType.MULTIPLIER){
    return 1
  }
  return 0
}