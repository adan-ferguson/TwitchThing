import { StatDefinitions, StatType } from './statDefinitions.js'

export default class Stats{

  constructor(statAffectors){
    this._statAffectors = statAffectors
  }

  get(name){
    let stat = StatDefinitions[name]

    if(!stat){
      throw 'Unknown stat type: ' + name
    }

    let value
    if(stat.type === StatType.COMPOSITE){
      value = this._getCompositeValue(name)
    }else if(stat.type === StatType.PERCENTAGE){
      value = this._getPercentageValue(name)
    }else if(stat.type === StatType.ADDITIVE_MULTIPLIER){
      value = this._getAdditiveMultiplierValue(name)
    }else if(stat.type === StatType.MULTIPLIER){
      value = this._getMultiplierValue(name)
    }

    return makeStatObject(name, value)
  }

  getAll(){
    const all = {}
    this._statAffectors.forEach(affector => {
      Object.keys(affector).forEach(key => {
        all[key] = true
      })
    })
    const allStats = {}
    Object.keys(all).forEach(type => allStats[type] = this.get(type))
    return allStats
  }

  serialize(){
    const serialized = {}
    Object.entries(this.getAll()).forEach(([statName, statDef]) => {
      serialized[statName] = statDef.value
    })
    return serialized
  }

  _getCompositeValue(name){
    const mods = this._getCompositeMods(name)
    let value = 0

    value = mods.flatPlus.reduce((val, mod) => {
      return val + mod
    }, value)

    value = mods.flatMinus.reduce((val, mod) => {
      return val - mod
    }, value)

    value = mods.pct.reduce((val, mod) => {
      return val * mod
    }, value)

    return value
  }

  _getPercentageValue(name){
    const mods = this._getCompositeMods(name)
    let value = 0

    value = mods.flatPlus.reduce((val, mod) => {
      return val + (1 - val) * mod
    }, value)

    value = mods.flatMinus.reduce((val, mod) => {
      return val * (1 + mod)
    }, value)

    return value
  }

  _getMultiplierValue(name){
    const mods = this._getPercentageMods(name)
    let value = 1

    value = mods.plus.reduce((val, mod) => {
      return val * mod
    }, value)

    value = mods.minus.reduce((val, mod) => {
      return val * mod
    }, value)

    return value
  }

  _getAdditiveMultiplierValue(name){
    const mods = this._getPercentageMods(name)
    let value = 1

    value = mods.plus.reduce((val, mod) => {
      return val + (mod - 1)
    }, value)

    value = mods.minus.reduce((val, mod) => {
      return val * mod
    }, value)

    return value
  }

  _getCompositeMods(name){

    const mods = {
      flatPlus: [],
      flatMinus: [],
      pct: []
    }

    this._statAffectors.forEach(affector => {
      if(name in affector){
        const change = affector[name]
        const changeStr = change + ''
        if(changeStr.charAt(changeStr.length - 1) === '%'){
          const value = (1 + parseFloat(changeStr) / 100)
          mods.pct.push(value)
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

  _getPercentageMods(name){

    const mods = {
      plus: [],
      minus: []
    }

    this._statAffectors.forEach(affector => {
      if(name in affector){
        const change = Math.max(0, affector[name])
        if(change >= 1){
          mods.plus.push(change)
        }else{
          mods.minus.push(change)
        }
      }
    })

    return mods
  }
}

export function makeStatObject(name, value){
  const stat = StatDefinitions[name]
  if('minimum' in stat){
    value = Math.max(0, value)
  }
  return {
    ...stat,
    name,
    value
  }
}

export function mergeStats(...statsObjs){
  const stats = new Stats(statsObjs)
  return stats.serialize()
}