import { StatType } from './statDefinitions.js'

export default {
  [StatType.FLAT]: flatValue,
  [StatType.MULTIPLIER]: multiplierValue,
  [StatType.PERCENTAGE]: percentageValue,
  [StatType.COMPOSITE]: compositeValue
}

export function parseStatVal(val){
  val = val + ''
  let value = parseFloat(val)
  if(val.charAt(val.length - 1) === '%'){
    return {
      isPct: true,
      value: value / 100
    }
  }
  return {
    isPct: false,
    value
  }
}

function flatValue(values, defaultValue){

  const mods = flatMods(values)
  let value = defaultValue

  value = mods.flatPlus.reduce((val, mod) => {
    return val + mod
  }, value)

  value = mods.flatMinus.reduce((val, mod) => {
    return val - mod
  }, value)

  return {
    value,
    mods
  }
}

function percentageValue(values, defaultValue){

  const mods =
    compositeMods(values)
  let value = defaultValue

  value = [...mods.flatPlus, ...mods.pctPlus].reduce((val, mod) => {
    return val + (1 - val) * mod
  }, value)

  value = [...mods.flatMinus, ...mods.pctMinus].reduce((val, mod) => {
    return val * (1 - mod)
  }, value)

  return {
    value,
    mods
  }
}
function multiplierValue(values, defaultValue){

  const mods = percentageMods(values)
  let value = defaultValue

  value = mods.plus.reduce((val, mod) => {
    return val + mod
  }, value)

  value = mods.minus.reduce((val, mod) => {
    return val * mod
  }, value)

  return {
    value,
    mods
  }
}

function compositeValue(values, defaultValue){
  const mods = compositeMods(values)
  let value = defaultValue

  value = mods.flatPlus.reduce((val, mod) => {
    return val + mod
  }, value)

  value = mods.flatMinus.reduce((val, mod) => {
    return val - mod
  }, value)

  value = mods.pctPlus.reduce((val, mod) => {
    return val * (1 + mod)
  }, value)

  value = mods.pctMinus.reduce((val, mod) => {
    return val * (1 - mod)
  }, value)

  return {
    value,
    mods
  }
}

/**
 * flatPlus example: 5
 * flatMinus example: -5
 * @param values [number|string]
 * @returns {{flatPlus: *[], flatMinus: *[]}}
 * @private
 */
function flatMods(values){

  const mods = {
    flatPlus: [],
    flatMinus: [],
  }

  values.forEach(value => {
    if(value > 0){
      mods.flatPlus.push(value)
    }else if(value < 0){
      mods.flatMinus.push(-value)
    }
  })

  return mods
}

/**
 * flatPlus example: 5
 * flatMinus example: -5
 * pctPlus example: '5%', '+5%'
 * pctMinus example: '-5%'
 * @param values [number|string]
 * @returns {{pctMinus: *[], flatPlus: *[], flatMinus: *[], pctPlus: *[]}}
 * @private
 */
function compositeMods(values){

  const mods = {
    flatPlus: [],
    flatMinus: [],
    pctPlus: [],
    pctMinus: []
  }

  values.forEach(change => {
    const { value, isPct } = parseStatVal(change)
    if(isPct){
      if(value > 0){
        mods.pctPlus.push(value)
      }else if(value < 0){
        mods.pctMinus.push(-value)
      }
    }else{
      if(value > 0){
        mods.flatPlus.push(value)
      }else if(change < 0){
        mods.flatMinus.push(-value)
      }
    }
  })

  return mods
}

/**
 * plus examples: '10%', '+10%'
 * minus examples: 0.9, '-10%'
 * @param values [number|string]
 * @returns {{minus: *[], plus: *[]}}
 * @private
 */
function percentageMods(values){

  const mods = {
    plus: [],
    minus: []
  }

  values.forEach(change => {
    const { value } = parseStatVal(change)
    if(value > 0){
      mods.plus.push(value)
    }else if(value < 0){
      mods.minus.push(1 + value)
    }
  })

  return mods
}