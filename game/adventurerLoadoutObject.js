export default class AdventurerLoadoutObject{

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