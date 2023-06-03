import LoadoutObject from './loadoutObject.js'

export default class AdventurerLoadoutObject extends LoadoutObject{

  _levelAdjust = 0

  get loadoutModifiers(){
    return this.data.loadoutModifiers ?? null
  }

  get level(){
    return this._level + this._levelAdjust
  }

  setLevelAdjust(levelAdjust){
    this._levelAdjust = levelAdjust
    this.invalidate()
  }
}