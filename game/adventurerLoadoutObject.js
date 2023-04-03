export default class AdventurerLoadoutObject{

  _data

  get data(){
    return this._data
  }

  get loadoutRestrictions(){
    return this.data.loadoutModifiers?.restrictions ?? null
  }

  get loadoutOrbModifiers(){
    return this.data.loadoutModifiers?.orbs ?? null
  }
}