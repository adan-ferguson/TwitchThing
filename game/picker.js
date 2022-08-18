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
      valueFormula: pickable => 1,
      weightFormula: pickable => 1,
      ...options
    }
    this._byValue = organizeByValue(registry, options.valueFormula)
  }

  pick(value){
    if(value < 1){
      return null
    }
    if(!this._byValue[value]){
      return this.pick(value - 1)
    }
    const choices = this._byValue[value].map(pickable => {
      return {
        value: pickable,
        weight: this._options.weightFormula(pickable)
      }
    })
    return chooseOne(choices)
  }
}

function organizeByValue(registry, formula){
  const byValue = {}
  for(let group in registry){
    for(let name in registry[group]){
      const pickable = registry[group][name]
      const val = formula(pickable)
      if(!byValue[val]){
        byValue[val] = []
      }
      byValue[val].push(pickable)
    }
  }
  return byValue
}