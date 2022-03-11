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

    let value = this._getCompositeStat(name)

    if('minimum' in stat){
      value = Math.max(0, value)
    }

    return {
      ...stat,
      name,
      value,
      convertedValue: convertValue(value, stat.type)
    }
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

  _getCompositeStat(type){
    return this._getFlatStatMod(type) * this._getPctStatMod(type + 'Pct')
  }

  _getFlatStatMod(type){
    return this._statAffectors.reduce((val, statAffector) => {
      return val + (statAffector[type] || 0)
    }, 0)
  }

  _getPctStatMod(type){
    return this._statAffectors.reduce((val, statAffector) => {
      return val * (statAffector[type] || 1)
    }, 1)
  }
}

export function mergeStats(...statsObjs){
  const combined = {}
  statsObjs.forEach(obj => {
    for(let key in obj){
      if(!combined[key]){
        combined[key] = 0
      }
      combined[key] += obj[key]
    }
  })
  return combined
}

/**
 * Convert a base stat to a LOL-style stat percentage.
 * -200 = 0.33
 * -100 = 0.50
 *    0 = 1
 *  100 = 2
 *  200 = 3
 * @param type
 */
function toLol(type){
  const val = this.getStat(type)
  if(val > 0){
    return 1 + val / 100
  }else {
    return 100 / (100 - val)
  }
}

function convertValue(val, type){

  if(type === StatType.PERCENTAGE){
    return val / 100
  }else if(type === StatType.LOLSCALED){
    return toLol(val)
  }else if(type === StatType.LOLSCALEDINVERTED){
    return toLol(-val)
  }

  return val
}