import { StatType } from './statDefinitions.js'

export default {
  [StatType.FLAT]: flatValue,
  [StatType.MULTIPLIER]: multiplierValue
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

  return value
}

function multiplierValue(values, defaultValue){

  const mods = percentageMods(values)
  let value = defaultValue

  value = mods.plus.reduce((val, mod) => {
    return val * mod
  }, value)

  value = mods.minus.reduce((val, mod) => {
    return val * mod
  }, value)

  return value
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

  values.forEach(change => {
    if(change > 0){
      mods.flatPlus.push(change)
    }else if(change < 0){
      mods.flatMinus.push(-change)
    }
  })

  return mods
}


/**
 * plus examples: 1.1, '10%', '+10%'
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
    let changeStr = change + ''
    if(changeStr.charAt(changeStr.length - 1) === '%'){
      if(changeStr.charAt(0) === '+'){
        changeStr = changeStr.slice(1)
      }
      change = (1 + parseFloat(changeStr) / 100)
    }else{
      change = Math.max(0, change)
    }

    if(change >= 1){
      mods.plus.push(change)
    }else{
      mods.minus.push(change)
    }
  })

  return mods
}