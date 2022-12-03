/**
 * Helps picking items from a given registry provided from a combined.js file
 */
import { chooseOne } from './rando.js'

export default class Picker{

  _options = {}

  constructor(registry, options = {}){
    this._registry = registry
    this._options = {
      valueFormula: pickable => 1,
      levelFormula: chestLevel => chestLevel,
      lowerDeviation: 1,
      higherDeviation: 1,
      ...options
    }
  }

  get list(){
    if(Array.isArray(this._registry)){
      return this._registry
    }
    const arr = []
    Object.values(this._registry).forEach(
      /** @param group {object} */
      (group) => {
        arr.push(...Object.values(group))
      })
    return arr
  }

  pick(chestLevel, filterFn = null){
    const choices = this.list.map(pickable => {
      return {
        value: pickable,
        weight: this.weight(this._options.valueFormula(pickable), chestLevel)
      }
    })
    return chooseOne(choices)
  }

  weight(value, chestLevel){
    const diff = value - this._options.levelFormula(chestLevel)
    return diff > 0 ?
      Math.pow(this._options.higherDeviation, diff) :
      Math.pow(this._options.lowerDeviation, -diff)
  }
}