import LoadoutObject from './loadoutObject.js'

export default class AdventurerLoadoutObject extends LoadoutObject{

  _data

  get data(){
    return this._data
  }

  get effect(){
    return this.data.effect ?? {}
  }

  get loadoutModifiers(){
    return this.data.loadoutModifiers ?? null
  }
}