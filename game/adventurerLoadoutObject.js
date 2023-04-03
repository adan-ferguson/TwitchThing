export default class AdventurerLoadoutObject{

  _data

  get data(){
    return this._data
  }

  get loadoutModifiers(){
    return this.data.loadoutModifiers ?? null
  }
}