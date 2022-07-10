export default class ModsCollection{

  constructor(){

    const mods = [...arguments].flat(Infinity)

    this._mods = {}
    mods.forEach(mod => {
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
    return this._mods[group]?.[name] ? true : false
  }
}