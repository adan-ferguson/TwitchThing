import { isString } from './utilFunctions.js'

export default class ModsCollection{

  constructor(){

    const mods = [...arguments].flat(Infinity)

    this._mods = {}
    mods.forEach(mod => {
      if(isString(mod)){
        mod = { name: mod }
      }
      mod.group = mod.group ?? 'generic'
      if(!this._mods[mod.group]){
        this._mods[mod.group] = []
      }
      this._mods[mod.group].push(mod)
    })
  }

  /**
   * Does this contain the given mod?
   * @param {group, name}
   * @returns {boolean}
   */
  contains({ group = 'generic', name }){
    const groupArr = this._mods[group]
    if(groupArr?.find(mod => mod.name === name)){
      return true
    }
    return false
  }
}