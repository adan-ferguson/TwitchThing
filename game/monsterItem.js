import { toDisplayName } from './utilFunctions.js'

export default class MonsterItem{
  
  constructor(data){
    this._data = data
  }

  get effect(){
    return this._data.effect
  }

  get displayName(){
    return this._data.displayName ??  toDisplayName(this._data.name)
  }
}