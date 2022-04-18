import { StatType } from './statDefinitions.js'

export default {
  [StatType.COMPOSITE]: compositeValue,
  [StatType.PERCENTAGE]: percentageValue,
  [StatType.ADDITIVE_MULTIPLIER]: additiveMultiplierValue,
  [StatType.MULTIPLIER]: multiplierValue
}

function compositeValue(affectors, name){

  const mods = compositeMods(affectors, name)
  let value = 0

  value = mods.flatPlus.reduce((val, mod) => {
    return val + mod
  }, value)

  value = mods.flatMinus.reduce((val, mod) => {
    return val - mod
  }, value)

  value = mods.pctPlus.reduce((val, mod) => {
    return (1 + val) * mod
  }, value)

  value = mods.pctMinus.reduce((val, mod) => {
    return (1 - val) * mod
  }, value)

  return value
}

function percentageValue(affectors, name){

  const mods = compositeMods(affectors, name)
  let value = 0

  value = [...mods.flatPlus, ...mods.pctPlus].reduce((val, mod) => {
    return val + (1 - val) * mod
  }, value)

  value = [...mods.flatMinus, ...mods.pctMinus].reduce((val, mod) => {
    return val * (1 + mod)
  }, value)

  return value
}

function additiveMultiplierValue(affectors, name){

  const mods = percentageMods(affectors, name)
  let value = 1

  value = mods.plus.reduce((val, mod) => {
    return val + (mod - 1)
  }, value)

  value = mods.minus.reduce((val, mod) => {
    return val * mod
  }, value)

  return value
}

function multiplierValue(affectors, name){

  const mods = percentageMods(affectors, name)
  let value = 1

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
 * pctPlus example: '5%', '+5%'
 * pctMinus example: '-5%'
 * @param affectors [statAffector]
 * @param name
 * @returns {{pctMinus: *[], flatPlus: *[], flatMinus: *[], pctPlus: *[]}}
 * @private
 */
function compositeMods(affectors, name){

  const mods = {
    flatPlus: [],
    flatMinus: [],
    pctPlus: [],
    pctMinus: []
  }

  affectors.forEach(affector => {
    if(name in affector){
      const change = affector[name]
      let changeStr = change + ''
      if(changeStr.charAt(changeStr.length - 1) === '%'){
        if(changeStr.charAt(0) === '+'){
          changeStr = changeStr.slice(1)
        }
        const value = parseFloat(changeStr) / 100
        if(value > 0){
          mods.pctPlus.push(value)
        }else if(value < 0){
          mods.pctMinus.push(-value)
        }
      }else{
        if(change > 0){
          mods.flatPlus.push(change)
        }else if(change < 0){
          mods.flatMinus.push(-change)
        }
      }
    }
  })

  return mods
}


/**
 * plus examples: 1.1, '10%', '+10%'
 * minus examples: 0.9, '-10%'
 * @param affectors
 * @param name
 * @returns {{minus: *[], plus: *[]}}
 * @private
 */
function percentageMods(affectors, name){

  const mods = {
    plus: [],
    minus: []
  }

  affectors.forEach(affector => {
    if(name in affector){

      let changeStr = affector[name] + ''
      let change
      if(changeStr.charAt(changeStr.length - 1) === '%'){
        if(changeStr.charAt(0) === '+'){
          changeStr = changeStr.slice(1)
        }
        change = (1 + parseFloat(changeStr) / 100)
      }else{
        change = Math.max(0, affector[name])
      }

      if(change >= 1){
        mods.plus.push(change)
      }else{
        mods.minus.push(change)
      }
    }
  })

  return mods
}