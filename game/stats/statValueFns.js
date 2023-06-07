import { StatType } from './statType.js'

export default {
  [StatType.FLAT]: flatValue,
  [StatType.MULTIPLIER]: multiplierValue,
  [StatType.PERCENTAGE]: percentageValue,
  [StatType.COMPOSITE]: compositeValue,
  [StatType.MINIMUM_ONLY]: minimumOnlyValue
}

export function parseStatVal(val){
  val = val + ''
  let value = parseFloat(val)
  if(val.charAt(val.length - 1) === 'x'){
    return {
      suffix: 'x',
      value: value
    }
  }else if(val.charAt(val.length - 1) === '%'){
    return {
      suffix: '%',
      value: value
    }
  }
  return {
    suffix: '',
    value
  }
}

function flatValue(values, defaultValue){
  const mods = organizeMods(values)

  if(mods.all.pct.length){
    throw 'Flat stats can not have percentage values'
  }

  if(mods.all.multi.length){
    throw 'Flat stats can not have multiplier values'
  }

  const value = mods.all.flat.reduce((val, mod) => {
    return val + mod
  }, defaultValue)

  return { value, mods }
}

/**
 * 0 to 1
 *
 * Only '25%' or '-25%' style values are valid.
 *
 * @param values
 * @param defaultValue
 * @returns {{mods, value}}
 */
function percentageValue(values, defaultValue){

  const mods = organizeMods(values)

  if(mods.all.flat.length){
    throw 'Percentage stats can not have flat values'
  }

  if(mods.all.multi.length){
    throw 'Percentage stats can not have multiplier values'
  }

  let value = mods.positive.pct.reduce((val, mod) => {
    if(mod > 100){
      throw 'Percentage stats can not have values over 100'
    }
    return val + (1 - val) * (mod / 100)
  }, defaultValue)

  value = mods.negative.pct.reduce((val, mod) => {
    if(mods < -100){
      throw 'Percentage stats can not have values under 100'
    }
    return val * (1 + mod / 100)
  }, value)

  return {
    value,
    mods
  }
}

/**
 * - No flat values
 * - No multis
 * - Sum the positive pcts + 100%
 * - Subtract the negative pcts until below 100%, then start multiplying
 * @param values
 * @param defaultValue
 */
function multiplierValue(values, defaultValue = 1){

  const mods = organizeMods(values)

  if(mods.all.multi.length){
    throw 'Multiplier stats can not have multiplier values (lol)'
  }

  const decimalPositive = mods.all.flat.map(m => m >= 1 ? 100 * (m - 1) : null).filter(m => m !== null)
  const decimalNegative = mods.all.flat.map(m => m < 1 ? 100 * (m - 1) : null).filter(m => m !== null)

  let value = [...decimalPositive, ...mods.positive.pct].reduce((val, mod) => {
    return val + mod
  }, 100)

  value = [...decimalNegative, ...mods.negative.pct].sort().reduce((val, mod) => {
    // return val * (1 + mod/100)
    if(val + mod > 100){
      return val + mod
    }else if(val < 100){
      return val * (1 + mod/100)
    }else{
      return val + mod
    }
  }, value)

  value = defaultValue * value / 100

  return {
    value,
    mods
  }
}

/**
 1) Do the flats
 2) Sum the positive pcts + 100%
 3) Subtract the negative pcts until below 100%, then start multiplying
 4) Multiply by the multis
 * @param values
 * @param defaultValue
 */
function compositeValue(values, defaultValue){

  const mods = organizeMods(values)

  let value = mods.all.flat.reduce((val, mod) => {
    return val + mod
  }, defaultValue)

  let pcts = mods.positive.pct.reduce((val, mod) => {
    return val + mod
  }, 100)

  pcts = mods.negative.pct.sort().reduce((val, mod) => {
    return val * (1 + mod/100)
    // if(val + mod > 100){
    //   return val = mod
    // }else if(val < 100){
    //   return val * (1 + mod/100)
    // }else{
    //   return val + mod
    // }
  }, pcts)

  value *= pcts / 100

  value = mods.all.multi.reduce((val, mod) => {
    return val * mod
  }, value)

  return {
    value,
    mods
  }
}

function minimumOnlyValue(values, defaultValue){
  const mods = organizeMods(values)

  if(mods.all.pct.length){
    throw 'Minimum-Only stats can not have percentage values'
  }

  if(mods.all.multi.length){
    throw 'Minimum-Only stats can not have multiplier values'
  }

  const value = mods.all.flat.reduce((val, mod) => {
    return Math.min(val, mod)
  }, defaultValue)

  return { value, mods }
}

/**
 * flatPlus example: 5
 * flatMinus example: -5
 * pctPlus example: '5%', '+5%'
 * pctMinus example: '-5%'
 * @param values [number|string]
 */
function organizeMods(values){

  const all = {
    flat: [],
    pct: [],
    multi: []
  }

  const positive = {
    flat: [],
    pct: [],
    multi: []
  }

  const negative = {
    flat: [],
    pct: [],
    multi: []
  }

  values.forEach(change => {
    const { value, suffix } = parseStatVal(change)
    if (suffix === '%'){
      all.pct.push(value);
      (value >= 0 ? positive : negative).pct.push(value)
    } else if (suffix === 'x'){
      all.multi.push(value);
      (value >= 1 ? positive : negative).multi.push(value)
    } else {
      all.flat.push(value);
      (value >= 0 ? positive : negative).flat.push(value)
    }
  })

  return {
    all,
    positive,
    negative
  }
}