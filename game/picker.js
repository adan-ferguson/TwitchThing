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

  pickOne(){
    const choices = this.list.map(pickable => {
      return {
        value: pickable,
        weight: this._options.weightFormula(pickable)
      }
    })
    return chooseOne(choices)
  }
}