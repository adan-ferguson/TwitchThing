/**
 * Helps picking items from a given registry provided from a combined.js file
 */
import { chooseOne } from './rando.js'

export default class Picker{

  _options = {}
  _byValue = {}

  constructor(registry, options = {}){
    this._registry = registry
    this._options = {
      valueFormula: objectDef => 1,
      weightFormula: objectDef => 1,
      ...options
    }
    this._byValue = organizeByValue(registry, options.valueFormula)
  }

  pick(value){
    if(!this._byValue[value]){
      if(value < 1){
        return this.pick(1)
      }else{
        return this.pick(value - 1)
      }
    }
    return chooseOne(this._byValue[value].map(key => {
      return {
        value: key,
        weight: this._options.weightFormula(this._registry[key])
      }
    }))
  }
}

function organizeByValue(registry, formula){
  const byValue = {}
  Object.keys(registry).forEach(key => {
    const val = formula(registry[key])
    if(!byValue[val]){
      byValue[val] = []
    }
    byValue[val].push(key)
  })
  return byValue
}