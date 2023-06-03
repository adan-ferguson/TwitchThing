import LoadoutObject from './loadoutObject.js'

export default class MonsterItem extends LoadoutObject{
  constructor(data){
    super()
    this._data = data
  }

  get calculateData(){
    return this._data
  }
}